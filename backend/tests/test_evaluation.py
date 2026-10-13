import pytest
import numpy as np
from sklearn.datasets import make_blobs
from backend.app.ml.evaluation import compute_clustering_metrics, compute_detailed_silhouette_analysis

def test_evaluation_silhouette():
    X, y = make_blobs(n_samples=100, centers=2, random_state=42)
    metrics = compute_clustering_metrics(X, y)

    assert metrics["num_clusters"] == 2
    assert metrics["silhouette_score"] is not None
    assert metrics["silhouette_score"] > 0.60
    assert metrics["davies_bouldin_index"] is not None
    assert metrics["calinski_harabasz_index"] is not None

    detailed = compute_detailed_silhouette_analysis(X, y)
    assert detailed["overall_score"] is not None
    assert len(detailed["samples"]) == 100
    assert detailed["verdict"] in ["Strong Separation", "Reasonable Structure"]
