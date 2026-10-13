import numpy as np
import time
from typing import Dict, Any, List, Tuple
from scipy.stats import multivariate_normal
from backend.app.models.em import EMStepSnapshot, EllipseData
from backend.app.ml.evaluation import compute_clustering_metrics

def compute_2d_ellipses(means: np.ndarray, covariances: np.ndarray) -> List[EllipseData]:
    ellipses = []
    for k in range(len(means)):
        mean_2d = means[k][:2]
        cov_2d = covariances[k][:2, :2]

        # Add slight ridge for numerical stability in eigenvalue decomposition
        cov_2d = cov_2d + np.eye(2) * 1e-6

        eigenvals, eigenvecs = np.linalg.eigh(cov_2d)
        # Order eigenvalues descending
        order = eigenvals.argsort()[::-1]
        eigenvals, eigenvecs = eigenvals[order], eigenvecs[:, order]

        # Angle in degrees with positive x-axis
        vx, vy = eigenvecs[:, 0]
        angle_deg = float(np.degrees(np.arctan2(vy, vx)))

        # 1-sigma (scale factor sqrt(2.296) for 68% chi-square) and 2-sigma (scale factor sqrt(5.991) for 95% chi-square)
        std_x = np.sqrt(max(eigenvals[0], 1e-6))
        std_y = np.sqrt(max(eigenvals[1], 1e-6))

        s1_scale = np.sqrt(2.296)
        s2_scale = np.sqrt(5.991)

        ellipses.append(EllipseData(
            component_index=k,
            mean=[round(float(m), 4) for m in mean_2d],
            sigma_1_rx=round(float(std_x * s1_scale), 4),
            sigma_1_ry=round(float(std_y * s1_scale), 4),
            sigma_2_rx=round(float(std_x * s2_scale), 4),
            sigma_2_ry=round(float(std_y * s2_scale), 4),
            angle_deg=round(angle_deg, 2)
        ))
    return ellipses

def run_em_step_by_step(
    X: np.ndarray,
    n_components: int = 3,
    covariance_type: str = "full",
    max_iter: int = 50,
    tol: float = 1e-3,
    random_state: int = 42
) -> Dict[str, Any]:
    start_time = time.time()
    n_samples, n_features = X.shape
    rng = np.random.RandomState(random_state)

    # 1. Initialize Means, Covariances, and Weights
    indices = rng.permutation(n_samples)[:n_components]
    means = X[indices].copy()
    weights = np.ones(n_components) / n_components

    # Initialize covariance matrices
    sample_cov = np.cov(X.T) if n_features > 1 else np.array([[np.var(X)]])
    if sample_cov.ndim == 0:
        sample_cov = np.array([[float(sample_cov)]])
    covariances = np.array([sample_cov + np.eye(n_features) * 1e-3 for _ in range(n_components)])

    steps: List[EMStepSnapshot] = []
    step_idx = 0

    # Compute initial responsibilities and log-likelihood
    resp = np.zeros((n_samples, n_components))
    for k in range(n_components):
        rv = multivariate_normal(mean=means[k], cov=covariances[k], allow_singular=True)
        resp[:, k] = weights[k] * rv.pdf(X)

    resp_sum = np.sum(resp, axis=1, keepdims=True)
    resp_sum[resp_sum == 0] = 1e-12
    log_likelihood = float(np.sum(np.log(resp_sum)))
    responsibilities = resp / resp_sum
    hard_assignments = np.argmax(responsibilities, axis=1)

    ellipses = compute_2d_ellipses(means, covariances) if n_features >= 2 else None

    # Step 0: Initialization
    steps.append(EMStepSnapshot(
        step_index=step_idx,
        iteration=0,
        phase="init",
        phase_name="Gaussian Mixture Initialization",
        means=[[round(float(v), 4) for v in m] for m in means],
        weights=[round(float(w), 4) for w in weights],
        covariances=[[[round(float(v), 4) for v in row] for row in cov] for cov in covariances],
        responsibilities=[[round(float(r), 4) for r in row] for row in responsibilities],
        hard_assignments=hard_assignments.tolist(),
        log_likelihood=round(log_likelihood, 4),
        delta_log_likelihood=None,
        ellipses_2d=ellipses,
        converged=False,
        math_formula="\\pi_k = \\frac{1}{K}, \\quad \\mu_k \\sim X_{\\text{init}}, \\quad \\Sigma_k = \\Sigma_{\\text{data}}",
        explanation=f"Initialized {n_components} Gaussian components with uniform weights (pi={1/n_components:.2f}) and empirical covariances."
    ))
    step_idx += 1

    converged = False
    prev_ll = log_likelihood

    for iteration in range(1, max_iter + 1):
        # --- E-STEP ---
        for k in range(n_components):
            rv = multivariate_normal(mean=means[k], cov=covariances[k], allow_singular=True)
            resp[:, k] = weights[k] * rv.pdf(X)

        resp_sum = np.sum(resp, axis=1, keepdims=True)
        resp_sum[resp_sum == 0] = 1e-12
        responsibilities = resp / resp_sum
        hard_assignments = np.argmax(responsibilities, axis=1)

        current_ll = float(np.sum(np.log(resp_sum)))
        delta_ll = current_ll - prev_ll
        ellipses = compute_2d_ellipses(means, covariances) if n_features >= 2 else None

        steps.append(EMStepSnapshot(
            step_index=step_idx,
            iteration=iteration,
            phase="e_step",
            phase_name=f"Iteration {iteration}: Expectation Step (E-Step)",
            means=[[round(float(v), 4) for v in m] for m in means],
            weights=[round(float(w), 4) for w in weights],
            covariances=[[[round(float(v), 4) for v in row] for row in cov] for cov in covariances],
            responsibilities=[[round(float(r), 4) for r in row] for row in responsibilities],
            hard_assignments=hard_assignments.tolist(),
            log_likelihood=round(current_ll, 4),
            delta_log_likelihood=round(delta_ll, 4),
            ellipses_2d=ellipses,
            converged=False,
            math_formula="\\gamma_{ik} = \\frac{\\pi_k \\mathcal{N}(x_i | \\mu_k, \\Sigma_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(x_i | \\mu_j, \\Sigma_j)}",
            explanation=f"E-Step: Evaluated soft responsibilities gamma_ik for each point. Current Log-Likelihood = {current_ll:.2f}."
        ))
        step_idx += 1

        # --- M-STEP ---
        N_k = np.sum(responsibilities, axis=0)
        # Avoid division by zero
        N_k = np.maximum(N_k, 1e-8)
        weights = N_k / n_samples

        for k in range(n_components):
            means[k] = np.sum(responsibilities[:, k:k+1] * X, axis=0) / N_k[k]
            diff = X - means[k]

            if covariance_type == "full":
                cov_k = np.dot(responsibilities[:, k] * diff.T, diff) / N_k[k]
                covariances[k] = cov_k + np.eye(n_features) * 1e-4  # Regularization
            elif covariance_type == "diag":
                cov_k = np.sum(responsibilities[:, k:k+1] * (diff ** 2), axis=0) / N_k[k]
                covariances[k] = np.diag(cov_k) + np.eye(n_features) * 1e-4
            elif covariance_type == "spherical":
                var_k = np.sum(responsibilities[:, k:k+1] * (diff ** 2)) / (N_k[k] * n_features)
                covariances[k] = np.eye(n_features) * (var_k + 1e-4)

        ellipses = compute_2d_ellipses(means, covariances) if n_features >= 2 else None

        steps.append(EMStepSnapshot(
            step_index=step_idx,
            iteration=iteration,
            phase="m_step",
            phase_name=f"Iteration {iteration}: Maximization Step (M-Step)",
            means=[[round(float(v), 4) for v in m] for m in means],
            weights=[round(float(w), 4) for w in weights],
            covariances=[[[round(float(v), 4) for v in row] for row in cov] for cov in covariances],
            responsibilities=[[round(float(r), 4) for r in row] for row in responsibilities],
            hard_assignments=hard_assignments.tolist(),
            log_likelihood=round(current_ll, 4),
            delta_log_likelihood=round(delta_ll, 4),
            ellipses_2d=ellipses,
            converged=(abs(delta_ll) < tol and iteration > 1),
            math_formula="\\mu_k = \\frac{1}{N_k}\\sum_{i} \\gamma_{ik} x_i, \\quad \\Sigma_k = \\frac{1}{N_k}\\sum_{i}\\gamma_{ik}(x_i-\\mu_k)(x_i-\\mu_k)^T",
            explanation=f"M-Step: Maximized component means, covariances, and prior mixture weights. Delta Log-Likelihood: {delta_ll:+.4f}."
        ))
        step_idx += 1

        if abs(delta_ll) < tol and iteration > 1:
            converged = True
            break

        prev_ll = current_ll

    # Final Step
    steps.append(EMStepSnapshot(
        step_index=step_idx,
        iteration=iteration,
        phase="convergence",
        phase_name="EM Convergence Reached" if converged else "Max Iterations Reached",
        means=[[round(float(v), 4) for v in m] for m in means],
        weights=[round(float(w), 4) for w in weights],
        covariances=[[[round(float(v), 4) for v in row] for row in cov] for cov in covariances],
        responsibilities=[[round(float(r), 4) for r in row] for row in responsibilities],
        hard_assignments=hard_assignments.tolist(),
        log_likelihood=round(current_ll, 4),
        delta_log_likelihood=0.0,
        ellipses_2d=ellipses,
        converged=True,
        math_formula="|\\ln p(X)^{(t)} - \\ln p(X)^{(t-1)}| < \\text{tol}",
        explanation=f"EM optimization converged in {iteration} iterations with final Log-Likelihood = {current_ll:.2f}." if converged else f"EM terminated at max iterations ({max_iter})."
    ))

    exec_time_ms = round((time.time() - start_time) * 1000, 2)
    metrics = compute_clustering_metrics(X, hard_assignments)
    metrics["log_likelihood"] = round(current_ll, 4)
    # Number of free parameters P for AIC/BIC
    num_params = n_components * n_features + n_components * (n_features * (n_features + 1) // 2) + (n_components - 1)
    metrics["bic"] = round(float(-2 * current_ll + num_params * np.log(n_samples)), 2)
    metrics["aic"] = round(float(-2 * current_ll + 2 * num_params), 2)
    metrics["total_iterations"] = iteration

    return {
        "algorithm_type": "em",
        "hyperparameters": {
            "n_components": n_components,
            "covariance_type": covariance_type,
            "max_iter": max_iter,
            "tol": tol,
            "random_state": random_state
        },
        "total_iterations": iteration,
        "converged": converged,
        "execution_time_ms": exec_time_ms,
        "metrics": metrics,
        "final_clusters": hard_assignments.tolist(),
        "steps": [s.model_dump() for s in steps]
    }
