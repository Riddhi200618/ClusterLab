import numpy as np
import time
from typing import Dict, Any, List, Optional
from scipy.spatial.distance import cdist
from backend.app.models.dbscan import DBSCANStepSnapshot
from backend.app.ml.evaluation import compute_clustering_metrics

def run_dbscan_step_by_step(
    X: np.ndarray,
    eps: float = 0.5,
    min_samples: int = 5,
    metric: str = "euclidean"
) -> Dict[str, Any]:
    start_time = time.time()
    n_samples, n_features = X.shape

    # Precompute pairwise distance matrix
    dist_matrix = cdist(X, X, metric=metric)

    # State arrays
    labels = np.full(n_samples, -1, dtype=int)  # -1 = unassigned / noise
    point_types = ["unvisited"] * n_samples     # 'unvisited', 'core', 'border', 'noise'

    steps: List[DBSCANStepSnapshot] = []
    step_idx = 0

    # Pre-calculate all neighborhoods for fast lookup
    neighborhoods = [np.where(dist_matrix[i] <= eps)[0].tolist() for i in range(n_samples)]

    # Step 0: Initialization
    steps.append(DBSCANStepSnapshot(
        step_index=step_idx,
        phase="init",
        phase_name="DBSCAN Initialization",
        current_point_idx=None,
        current_point_coord=None,
        current_point_type=None,
        neighborhood_indices=[],
        active_cluster_id=None,
        cluster_labels=labels.tolist(),
        point_types=list(point_types),
        queue_indices=[],
        math_formula="N_\\varepsilon(p) = \\{q \\in D \\mid \\text{dist}(p, q) \\le \\varepsilon\\}, \\quad |N_\\varepsilon(p)| \\ge \\text{MinPts}",
        explanation=f"Initialized DBSCAN with Epsilon = {eps:.2f} and MinPts = {min_samples}. All {n_samples} points are currently unvisited."
    ))
    step_idx += 1

    current_cluster_id = 0
    visited = np.zeros(n_samples, dtype=bool)

    # Educational snapshot cadence limiter
    max_steps_limit = 40
    step_interval = max(1, n_samples // 20)

    for i in range(n_samples):
        if visited[i]:
            continue

        visited[i] = True
        neighbors_i = neighborhoods[i]

        # Step: Point Query Snapshot
        if step_idx < max_steps_limit:
            steps.append(DBSCANStepSnapshot(
                step_index=step_idx,
                phase="point_query",
                phase_name=f"Inspecting Point #{i}",
                current_point_idx=i,
                current_point_coord=[round(float(v), 4) for v in X[i][:2]],
                current_point_type="inspecting",
                neighborhood_indices=neighbors_i,
                active_cluster_id=current_cluster_id if len(neighbors_i) >= min_samples else None,
                cluster_labels=labels.tolist(),
                point_types=list(point_types),
                queue_indices=[],
                math_formula="|N_\\varepsilon(p_i)| = " + str(len(neighbors_i)),
                explanation=f"Found {len(neighbors_i)} neighbors within radius {eps:.2f}. MinPts threshold is {min_samples}."
            ))
            step_idx += 1

        if len(neighbors_i) < min_samples:
            # Mark as tentative noise (unless already assigned as border point)
            if labels[i] == -1:
                point_types[i] = "noise"
        else:
            # Point is a CORE POINT -> Start new cluster!
            point_types[i] = "core"
            labels[i] = current_cluster_id

            queue = [idx for idx in neighbors_i if idx != i]

            if step_idx < max_steps_limit:
                steps.append(DBSCANStepSnapshot(
                    step_index=step_idx,
                    phase="core_expand",
                    phase_name=f"Core Point Found: Starting Cluster {current_cluster_id}",
                    current_point_idx=i,
                    current_point_coord=[round(float(v), 4) for v in X[i][:2]],
                    current_point_type="core",
                    neighborhood_indices=neighbors_i,
                    active_cluster_id=current_cluster_id,
                    cluster_labels=labels.tolist(),
                    point_types=list(point_types),
                    queue_indices=list(queue),
                    math_formula="|N_\\varepsilon(p_i)| \\ge \\text{MinPts} \\implies p_i \\in \\text{Core}",
                    explanation=f"Point #{i} has {len(neighbors_i)} neighbors (>= {min_samples}). Starting Cluster #{current_cluster_id} with {len(queue)} seeded points in expansion queue."
                ))
                step_idx += 1

            q_ptr = 0
            while q_ptr < len(queue):
                q_idx = queue[q_ptr]
                q_ptr += 1

                # If previously marked noise, it becomes a border point
                if point_types[q_idx] == "noise":
                    point_types[q_idx] = "border"
                    labels[q_idx] = current_cluster_id

                if not visited[q_idx]:
                    visited[q_idx] = True
                    labels[q_idx] = current_cluster_id
                    q_neighbors = neighborhoods[q_idx]

                    if len(q_neighbors) >= min_samples:
                        # Density-reachable Core point
                        point_types[q_idx] = "core"
                        # Expand frontier
                        for n_idx in q_neighbors:
                            if n_idx not in queue and not visited[n_idx]:
                                queue.append(n_idx)
                    else:
                        point_types[q_idx] = "border"

                # Snapshot during expansion at intervals
                if q_ptr % 8 == 0 and step_idx < max_steps_limit:
                    steps.append(DBSCANStepSnapshot(
                        step_index=step_idx,
                        phase="core_expand",
                        phase_name=f"Expanding Cluster {current_cluster_id} (Queue size: {len(queue) - q_ptr})",
                        current_point_idx=q_idx,
                        current_point_coord=[round(float(v), 4) for v in X[q_idx][:2]],
                        current_point_type=point_types[q_idx],
                        neighborhood_indices=neighborhoods[q_idx],
                        active_cluster_id=current_cluster_id,
                        cluster_labels=labels.tolist(),
                        point_types=list(point_types),
                        queue_indices=queue[q_ptr:q_ptr+10],
                        math_formula="p \\rightarrow_{\\text{density}} q \\implies q \\in C",
                        explanation=f"Density connectivity propagated cluster {current_cluster_id} to point #{q_idx} ({point_types[q_idx]})."
                    ))
                    step_idx += 1

            current_cluster_id += 1

    # Step Final: Completion
    steps.append(DBSCANStepSnapshot(
        step_index=step_idx,
        phase="complete",
        phase_name="DBSCAN Execution Complete",
        current_point_idx=None,
        current_point_coord=None,
        current_point_type=None,
        neighborhood_indices=[],
        active_cluster_id=None,
        cluster_labels=labels.tolist(),
        point_types=list(point_types),
        queue_indices=[],
        math_formula="D = \\bigcup_{k=0}^{K-1} C_k \\cup \\text{Noise}",
        explanation=f"DBSCAN finished. Formed {current_cluster_id} dense clusters. Classified {point_types.count('core')} core, {point_types.count('border')} border, and {point_types.count('noise')} noise points."
    ))

    exec_time_ms = round((time.time() - start_time) * 1000, 2)
    metrics = compute_clustering_metrics(X, labels)
    metrics["num_core_points"] = point_types.count("core")
    metrics["num_border_points"] = point_types.count("border")
    metrics["num_noise_points"] = point_types.count("noise")

    return {
        "algorithm_type": "dbscan",
        "hyperparameters": {
            "eps": eps,
            "min_samples": min_samples,
            "metric": metric
        },
        "total_iterations": len(steps),
        "converged": True,
        "execution_time_ms": exec_time_ms,
        "metrics": metrics,
        "final_clusters": labels.tolist(),
        "steps": [s.model_dump() for s in steps]
    }
