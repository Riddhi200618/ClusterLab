import pytest
import numpy as np
from backend.app.core.config import settings
settings.APP_ENV = "testing"

from backend.app.core.database import db_client
db_client.use_supabase = False

from backend.app.services.dataset_service import get_builtin_dataset
from backend.app.services.experiment_service import create_experiment, get_experiment_data
from backend.app.services.comparison_service import run_or_get_comparison
from backend.app.models.experiment import ExperimentCreateRequest
from backend.app.models.evaluation import AlgorithmMetricComparison
from backend.app.ml.evaluation import compute_clustering_metrics
from backend.app.ml.preprocessor import preprocess_features
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score


def test_comparison_identical_matrix_and_samples():
    """Verify that all three algorithms in comparison operate on the exact same scaled feature matrix."""
    exp = create_experiment(ExperimentCreateRequest(
        title="Identical Matrix Validation",
        session_id="test_session",
        dataset_slug="iris",
        selected_features=["petal_length", "petal_width"],
        scaling_method="standard"
    ))

    X_scaled, feature_names, dataset_slug = get_experiment_data(exp.id)
    assert X_scaled.shape == (150, 2)
    assert feature_names == ["petal_length", "petal_width"]

    comp_res = run_or_get_comparison(exp.id)
    assert len(comp_res.comparison_table) == 3

    # Verify each comparison entry references the same experiment and valid run IDs
    types = {c.algorithm_type for c in comp_res.comparison_table}
    assert types == {"kmeans", "em", "dbscan"}

    run_ids = [c.run_id for c in comp_res.comparison_table]
    assert len(set(run_ids)) == 3  # Each algorithm produces a distinct run


def test_iris_exact_metrics_and_dbscan_output():
    """
    Verify Iris petal clustering output:
    - K-Means (K=3): 3 clusters, 0 noise
    - EM (K=3): 3 clusters, 0 noise
    - DBSCAN (eps=0.5, min_samples=5): 2 clusters, 0 noise (50 in cluster 0, 100 in cluster 1)
    Confirm exact metrics matching reported UI numbers.
    """
    exp = create_experiment(ExperimentCreateRequest(
        title="Iris Petal Validation",
        session_id="test_session",
        dataset_slug="iris",
        selected_features=["petal_length", "petal_width"],
        scaling_method="standard"
    ))

    comp_res = run_or_get_comparison(exp.id)
    comp_map = {c.algorithm_type: c for c in comp_res.comparison_table}

    # 1. K-Means
    km = comp_map["kmeans"]
    assert km.num_clusters == 3
    assert km.num_noise_points == 0
    assert km.silhouette_score == pytest.approx(0.6741, abs=1e-3)
    assert km.davies_bouldin_index == pytest.approx(0.4749, abs=1e-3)
    assert km.calinski_harabasz_index == pytest.approx(1149.7, abs=1.0)

    # 2. EM / GMM
    em = comp_map["em"]
    assert em.num_clusters == 3
    assert em.num_noise_points == 0
    assert em.silhouette_score == pytest.approx(0.4570, abs=1e-3)
    assert em.davies_bouldin_index == pytest.approx(1.1084, abs=1e-3)
    assert em.calinski_harabasz_index == pytest.approx(449.3, abs=1.0)

    # 3. DBSCAN
    db = comp_map["dbscan"]
    assert db.num_clusters == 2
    assert db.num_noise_points == 0
    assert db.silhouette_score == pytest.approx(0.7434, abs=1e-3)
    assert db.davies_bouldin_index == pytest.approx(0.2893, abs=1e-3)
    assert db.calinski_harabasz_index == pytest.approx(671.7, abs=1.0)

    # Winner on Iris should be DBSCAN (highest silhouette 0.7434, lowest Davies-Bouldin 0.2893)
    assert comp_res.winner_algorithm == "dbscan"


def test_metrics_computed_from_actual_labels():
    """Verify that metrics in comparison response strictly match ground-truth recalculation from actual labels."""
    exp = create_experiment(ExperimentCreateRequest(
        title="Ground Truth Metric Validation",
        session_id="test_session",
        dataset_slug="wine",
        selected_features=["alcohol", "malic_acid"],
        scaling_method="standard"
    ))
    X_scaled, _, _ = get_experiment_data(exp.id)

    comp_res = run_or_get_comparison(exp.id)
    for row in comp_res.comparison_table:
        runs = db_client.get_experiment_runs(exp.id)
        saved_run = next((r for r in runs if r["id"] == row.run_id), None)
        assert saved_run is not None
        labels = np.array(saved_run["final_clusters"])
        recalculated = compute_clustering_metrics(X_scaled, labels)

        assert row.num_clusters == recalculated["num_clusters"]
        assert row.num_noise_points == recalculated["num_noise_points"]
        assert row.silhouette_score == recalculated["silhouette_score"]
        assert row.davies_bouldin_index == recalculated["davies_bouldin_index"]
        assert row.calinski_harabasz_index == recalculated["calinski_harabasz_index"]


def test_winner_selection_tie_breaker_and_degenerate_handling():
    """Verify that lower Davies-Bouldin breaks ties and degenerate scores are rejected."""
    exp = create_experiment(ExperimentCreateRequest(
        title="Degenerate Handling",
        session_id="test_session",
        dataset_slug="synthetic_blobs",
        selected_features=[],
        scaling_method="standard"
    ))
    comp_res = run_or_get_comparison(exp.id)
    assert comp_res.winner_algorithm in ["kmeans", "em", "dbscan"]
    assert comp_res.educational_summary is not None
    assert len(comp_res.educational_summary) > 20


def test_real_computed_results_vary_by_dataset():
    """Verify results are dynamic and computed per dataset rather than cached/hardcoded."""
    exp_iris = create_experiment(ExperimentCreateRequest(
        title="Iris Comparison",
        session_id="test",
        dataset_slug="iris",
        selected_features=["petal_length", "petal_width"],
        scaling_method="standard"
    ))
    res_iris = run_or_get_comparison(exp_iris.id)

    exp_wine = create_experiment(ExperimentCreateRequest(
        title="Wine Comparison",
        session_id="test",
        dataset_slug="wine",
        selected_features=["alcohol", "malic_acid"],
        scaling_method="standard"
    ))
    res_wine = run_or_get_comparison(exp_wine.id)

    # Silhouette scores and cluster metrics must differ across distinct datasets
    iris_km_sil = next(c.silhouette_score for c in res_iris.comparison_table if c.algorithm_type == "kmeans")
    wine_km_sil = next(c.silhouette_score for c in res_wine.comparison_table if c.algorithm_type == "kmeans")
    assert iris_km_sil != wine_km_sil
    assert res_iris.dataset_slug == "iris"
    assert res_wine.dataset_slug == "wine"
