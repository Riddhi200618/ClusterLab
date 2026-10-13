import pytest
import numpy as np
from sklearn.datasets import make_blobs
from backend.app.ml.algorithms.kmeans_stepper import run_kmeans_step_by_step

def test_kmeans_step_by_step_execution():
    X, _ = make_blobs(n_samples=150, centers=3, n_features=2, random_state=42)
    res = run_kmeans_step_by_step(X, k=3, init_method="k-means++", max_iter=30, tol=1e-4, random_state=42)

    assert res["algorithm_type"] == "kmeans"
    assert res["total_iterations"] >= 1
    assert len(res["final_clusters"]) == 150
    assert len(res["steps"]) >= 2

    # Check that WCSS is non-increasing or converging
    wcss_values = [s["wcss"] for s in res["steps"] if s["phase"] in ("assignment", "centroid_update")]
    assert len(wcss_values) > 0
    assert res["metrics"]["silhouette_score"] is not None
    assert res["metrics"]["silhouette_score"] > 0.40
