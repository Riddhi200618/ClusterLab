import numpy as np
import time
from typing import Dict, Any, List, Tuple
from backend.app.models.kmeans import KMeansStepSnapshot, KMeansRunResponse
from backend.app.ml.evaluation import compute_clustering_metrics

def kmeans_plus_plus_init(X: np.ndarray, k: int, random_state: int = 42) -> np.ndarray:
    rng = np.random.RandomState(random_state)
    n_samples, n_features = X.shape
    centroids = np.zeros((k, n_features))

    # 1. Choose first center uniformly at random
    first_idx = rng.randint(n_samples)
    centroids[0] = X[first_idx]

    # 2. For remaining centers, sample proportional to D(x)^2
    for i in range(1, k):
        # Distance squared to closest centroid so far
        dists = np.min(np.sum((X[:, np.newaxis, :] - centroids[:i, :]) ** 2, axis=2), axis=1)
        probs = dists / np.sum(dists)
        next_idx = rng.choice(n_samples, p=probs)
        centroids[i] = X[next_idx]

    return centroids

def run_kmeans_step_by_step(
    X: np.ndarray,
    k: int = 3,
    init_method: str = "k-means++",
    max_iter: int = 50,
    tol: float = 1e-4,
    random_state: int = 42
) -> Dict[str, Any]:
    start_time = time.time()
    n_samples, n_features = X.shape
    rng = np.random.RandomState(random_state)

    # Initialization Phase
    if init_method == "k-means++":
        centroids = kmeans_plus_plus_init(X, k, random_state)
        init_desc = f"Initialized {k} centroids using K-Means++ probabilistic distance-weighted distribution."
    else:
        indices = rng.permutation(n_samples)[:k]
        centroids = X[indices].copy()
        init_desc = f"Initialized {k} centroids by picking random data sample indices: {list(indices)}."

    steps: List[KMeansStepSnapshot] = []
    step_idx = 0

    # Compute initial nearest assignments
    dists_sq = np.sum((X[:, np.newaxis, :] - centroids[np.newaxis, :, :]) ** 2, axis=2)
    assignments = np.argmin(dists_sq, axis=1)
    wcss = float(np.sum(np.min(dists_sq, axis=1)))

    # Step 0: Initial Centroids
    steps.append(KMeansStepSnapshot(
        step_index=step_idx,
        iteration=0,
        phase="init",
        phase_name="Centroid Initialization",
        centroids=centroids.tolist(),
        previous_centroids=None,
        centroid_shifts=None,
        assignments=assignments.tolist(),
        wcss=round(wcss, 4),
        delta_wcss=None,
        converged=False,
        math_formula="\\mu_k \\sim P(\\mu) \\quad \\text{where } k \\in \\{1, \\dots, K\\}",
        explanation=init_desc
    ))
    step_idx += 1

    converged = False
    prev_wcss = wcss

    for iteration in range(1, max_iter + 1):
        prev_centroids = centroids.copy()

        # 1. Assignment Phase
        dists_sq = np.sum((X[:, np.newaxis, :] - centroids[np.newaxis, :, :]) ** 2, axis=2)
        assignments = np.argmin(dists_sq, axis=1)
        wcss = float(np.sum(np.min(dists_sq, axis=1)))
        delta_wcss = wcss - prev_wcss

        steps.append(KMeansStepSnapshot(
            step_index=step_idx,
            iteration=iteration,
            phase="assignment",
            phase_name=f"Iteration {iteration}: Cluster Assignment",
            centroids=centroids.tolist(),
            previous_centroids=prev_centroids.tolist(),
            centroid_shifts=None,
            assignments=assignments.tolist(),
            wcss=round(wcss, 4),
            delta_wcss=round(delta_wcss, 4),
            converged=False,
            math_formula="c_i = \\arg\\min_{k} \\|x_i - \\mu_k\\|^2",
            explanation=f"Assigned each of the {n_samples} points to its nearest centroid. Current WCSS: {wcss:.2f}."
        ))
        step_idx += 1

        # 2. Centroid Update Phase
        new_centroids = np.zeros_like(centroids)
        shifts = []
        for j in range(k):
            cluster_points = X[assignments == j]
            if len(cluster_points) > 0:
                new_centroids[j] = np.mean(cluster_points, axis=0)
            else:
                # Handle empty cluster by reinitializing randomly
                new_centroids[j] = X[rng.randint(n_samples)]
            shift = float(np.linalg.norm(new_centroids[j] - prev_centroids[j]))
            shifts.append(shift)

        centroids = new_centroids
        total_shift = float(np.sum(shifts))

        steps.append(KMeansStepSnapshot(
            step_index=step_idx,
            iteration=iteration,
            phase="centroid_update",
            phase_name=f"Iteration {iteration}: Centroid Recalculation",
            centroids=centroids.tolist(),
            previous_centroids=prev_centroids.tolist(),
            centroid_shifts=[round(s, 5) for s in shifts],
            assignments=assignments.tolist(),
            wcss=round(wcss, 4),
            delta_wcss=round(delta_wcss, 4),
            converged=(total_shift < tol),
            math_formula="\\mu_k^{(t+1)} = \\frac{1}{|S_k|} \\sum_{x_i \\in S_k} x_i",
            explanation=f"Centroids updated to mean of cluster points. Total centroid displacement: {total_shift:.5f} units."
        ))
        step_idx += 1

        if total_shift < tol:
            converged = True
            break

        prev_wcss = wcss

    # Final Convergence Snapshot
    steps.append(KMeansStepSnapshot(
        step_index=step_idx,
        iteration=iteration,
        phase="convergence",
        phase_name="Convergence Achieved" if converged else "Max Iterations Reached",
        centroids=centroids.tolist(),
        previous_centroids=centroids.tolist(),
        centroid_shifts=[0.0] * k,
        assignments=assignments.tolist(),
        wcss=round(wcss, 4),
        delta_wcss=0.0,
        converged=True,
        math_formula="\\Delta \\mu < \\text{tol} \\implies \\text{Convergence}",
        explanation=f"Algorithm converged after {iteration} iterations with final WCSS = {wcss:.2f}." if converged else f"Reached maximum allowed iterations ({max_iter})."
    ))

    exec_time_ms = round((time.time() - start_time) * 1000, 2)
    metrics = compute_clustering_metrics(X, assignments)
    metrics["wcss"] = round(wcss, 4)
    metrics["total_iterations"] = iteration

    return {
        "algorithm_type": "kmeans",
        "hyperparameters": {
            "k": k,
            "init_method": init_method,
            "max_iter": max_iter,
            "tol": tol,
            "random_state": random_state
        },
        "total_iterations": iteration,
        "converged": converged,
        "execution_time_ms": exec_time_ms,
        "metrics": metrics,
        "final_clusters": assignments.tolist(),
        "steps": [s.model_dump() for s in steps]
    }
