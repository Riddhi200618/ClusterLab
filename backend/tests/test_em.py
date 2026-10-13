import pytest
import numpy as np
from sklearn.datasets import make_blobs
from backend.app.ml.algorithms.em_stepper import run_em_step_by_step

def test_em_step_by_step_execution():
    X, _ = make_blobs(n_samples=150, centers=3, n_features=2, random_state=42)
    res = run_em_step_by_step(X, n_components=3, covariance_type="full", max_iter=30, tol=1e-3, random_state=42)

    assert res["algorithm_type"] == "em"
    assert res["total_iterations"] >= 1
    assert len(res["final_clusters"]) == 150
    assert len(res["steps"]) >= 2

    # Responsibilities should sum to 1 for every sample in E-step
    e_steps = [s for s in res["steps"] if s["phase"] == "e_step"]
    if e_steps:
        resp = np.array(e_steps[-1]["responsibilities"])
        row_sums = np.sum(resp, axis=1)
        np.testing.assert_allclose(row_sums, np.ones(150), atol=1e-4)

    assert "log_likelihood" in res["metrics"]
    assert res["metrics"]["silhouette_score"] is not None
