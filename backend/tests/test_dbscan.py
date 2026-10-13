import pytest
import numpy as np
from sklearn.datasets import make_moons
from backend.app.ml.algorithms.dbscan_stepper import run_dbscan_step_by_step

def test_dbscan_step_by_step_execution():
    X, _ = make_moons(n_samples=150, noise=0.05, random_state=42)
    res = run_dbscan_step_by_step(X, eps=0.25, min_samples=5, metric="euclidean")

    assert res["algorithm_type"] == "dbscan"
    assert len(res["final_clusters"]) == 150
    assert len(res["steps"]) >= 2
    assert res["metrics"]["num_clusters"] >= 2
    assert "num_core_points" in res["metrics"]
    assert "num_border_points" in res["metrics"]
    assert "num_noise_points" in res["metrics"]
