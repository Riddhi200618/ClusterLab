from backend.app.core.config import settings
settings.APP_ENV = "testing"

from backend.app.core.database import db_client
db_client.use_supabase = False

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_api_list_datasets():
    response = client.get("/api/v1/datasets")
    assert response.status_code == 200
    datasets = response.json()
    assert len(datasets) >= 6
    slugs = [d["slug"] for d in datasets]
    assert "iris" in slugs
    assert "synthetic_blobs" in slugs

def test_api_full_experiment_flow():
    # 1. Create experiment
    exp_res = client.post("/api/v1/experiments", json={
        "title": "Iris Petal Clustering Lab",
        "session_id": "test_student",
        "dataset_slug": "iris",
        "selected_features": ["petal_length", "petal_width"],
        "scaling_method": "standard"
    })
    assert exp_res.status_code == 200
    exp_data = exp_res.json()
    exp_id = exp_data["id"]
    assert exp_id is not None
    assert len(exp_data["preprocessed_points"]) == 150

    # 2. Run K-Means on experiment
    km_res = client.post("/api/v1/algorithms/kmeans/run", json={
        "experiment_id": exp_id,
        "k": 3,
        "init_method": "k-means++",
        "max_iter": 30,
        "tol": 1e-4,
        "random_state": 42
    })
    assert km_res.status_code == 200
    km_data = km_res.json()
    assert km_data["algorithm_type"] == "kmeans"
    assert len(km_data["steps"]) > 0
    assert km_data["metrics"]["silhouette_score"] is not None

    # 3. Run EM on experiment
    em_res = client.post("/api/v1/algorithms/em/run", json={
        "experiment_id": exp_id,
        "n_components": 3,
        "covariance_type": "full",
        "max_iter": 30,
        "tol": 1e-3,
        "random_state": 42
    })
    assert em_res.status_code == 200
    em_data = em_res.json()
    assert em_data["algorithm_type"] == "em"
    assert len(em_data["steps"]) > 0

    # 4. Run DBSCAN on experiment
    db_res = client.post("/api/v1/algorithms/dbscan/run", json={
        "experiment_id": exp_id,
        "eps": 0.5,
        "min_samples": 5,
        "metric": "euclidean"
    })
    assert db_res.status_code == 200
    db_data = db_res.json()
    assert db_data["algorithm_type"] == "dbscan"
    assert len(db_data["steps"]) > 0

    # 5. Compare all 3 algorithms
    comp_res = client.post("/api/v1/evaluation/compare", json={
        "experiment_id": exp_id
    })
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert len(comp_data["comparison_table"]) == 3
    assert comp_data["winner_algorithm"] in ["kmeans", "em", "dbscan"]
