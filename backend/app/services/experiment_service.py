import uuid
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from backend.app.core.database import db_client
from backend.app.services.dataset_service import get_or_load_dataset
from backend.app.ml.preprocessor import preprocess_features, project_to_2d_if_needed
from backend.app.ml.algorithms.kmeans_stepper import run_kmeans_step_by_step
from backend.app.ml.algorithms.em_stepper import run_em_step_by_step
from backend.app.ml.algorithms.dbscan_stepper import run_dbscan_step_by_step
from backend.app.ml.evaluation import compute_detailed_silhouette_analysis
from backend.app.models.experiment import ExperimentCreateRequest, ExperimentResponse

EXPERIMENT_DATA_CACHE: Dict[str, Dict[str, Any]] = {}

def create_experiment(req: ExperimentCreateRequest) -> ExperimentResponse:
    exp_id = str(uuid.uuid4())

    # Foreign key lookup: lookup dataset_id for pre-seeded datasets, or None for custom synthetic variations
    dataset_id = None
    if not req.custom_synthetic_params:
        try:
            ds = db_client.get_dataset_by_slug(req.dataset_slug)
            if ds and "id" in ds:
                dataset_id = ds["id"]
        except Exception:
            dataset_id = None

    # Load dataset
    X_raw, all_feature_names, meta = get_or_load_dataset(req.dataset_slug, req.custom_synthetic_params)

    # Filter features
    if req.selected_features and len(req.selected_features) > 0:
        valid_indices = [all_feature_names.index(f) for f in req.selected_features if f in all_feature_names]
        if len(valid_indices) == 0:
            valid_indices = [0, 1] if len(all_feature_names) >= 2 else [0]
    else:
        valid_indices = [0, 1] if len(all_feature_names) >= 2 else [0]

    selected_names = [all_feature_names[i] for i in valid_indices]
    X_selected = X_raw[:, valid_indices]

    # Preprocess
    X_scaled = preprocess_features(X_selected, req.scaling_method)

    # Persist experiment config
    exp_record = {
        "id": exp_id,
        "title": req.title,
        "session_id": req.session_id,
        "dataset_id": dataset_id,
        "dataset_slug": req.dataset_slug,
        "selected_features": selected_names,
        "scaling_method": req.scaling_method,
        "sample_size": len(X_raw)
    }
    db_client.save_experiment(exp_record)

    # Cache matrix in memory
    EXPERIMENT_DATA_CACHE[exp_id] = {
        "X_raw": X_selected,
        "X_scaled": X_scaled,
        "feature_names": selected_names,
        "dataset_slug": req.dataset_slug
    }

    return ExperimentResponse(
        id=exp_id,
        title=req.title,
        session_id=req.session_id,
        dataset_slug=req.dataset_slug,
        selected_features=selected_names,
        scaling_method=req.scaling_method,
        sample_size=len(X_raw),
        raw_points=[[round(float(v), 4) for v in row] for row in X_selected],
        preprocessed_points=[[round(float(v), 4) for v in row] for row in X_scaled],
        feature_names=selected_names,
        created_at=exp_record.get("created_at", "")
    )

def get_experiment_data(exp_id: str) -> Tuple[np.ndarray, List[str], str]:
    if exp_id in EXPERIMENT_DATA_CACHE:
        c = EXPERIMENT_DATA_CACHE[exp_id]
        return c["X_scaled"], c["feature_names"], c["dataset_slug"]

    # Fetch from DB if not in memory cache
    exp = db_client.get_experiment(exp_id)
    if not exp:
        raise ValueError(f"Experiment with ID {exp_id} not found.")

    X_raw, all_feature_names, _ = get_or_load_dataset(exp["dataset_slug"])
    valid_indices = [all_feature_names.index(f) for f in exp["selected_features"] if f in all_feature_names]
    if len(valid_indices) == 0:
        valid_indices = [0, 1]

    selected_names = [all_feature_names[i] for i in valid_indices]
    X_selected = X_raw[:, valid_indices]
    X_scaled = preprocess_features(X_selected, exp.get("scaling_method", "standard"))

    EXPERIMENT_DATA_CACHE[exp_id] = {
        "X_raw": X_selected,
        "X_scaled": X_scaled,
        "feature_names": selected_names,
        "dataset_slug": exp["dataset_slug"]
    }
    return X_scaled, selected_names, exp["dataset_slug"]

def run_experiment_kmeans(exp_id: str, k: int, init_method: str, max_iter: int, tol: float, random_state: int) -> Dict[str, Any]:
    X, feature_names, _ = get_experiment_data(exp_id)
    res = run_kmeans_step_by_step(X, k=k, init_method=init_method, max_iter=max_iter, tol=tol, random_state=random_state)

    run_id = str(uuid.uuid4())
    res["run_id"] = run_id
    res["experiment_id"] = exp_id

    # Save run
    db_client.save_experiment_run({
        "id": run_id,
        "experiment_id": exp_id,
        "algorithm_type": "kmeans",
        "hyperparameters": res["hyperparameters"],
        "total_iterations": res["total_iterations"],
        "converged": res["converged"],
        "execution_time_ms": res["execution_time_ms"],
        "silhouette_score": res["metrics"].get("silhouette_score"),
        "davies_bouldin_index": res["metrics"].get("davies_bouldin_index"),
        "calinski_harabasz_index": res["metrics"].get("calinski_harabasz_index"),
        "num_clusters_found": res["metrics"]["num_clusters"],
        "num_noise_points": res["metrics"].get("num_noise_points", 0),
        "final_clusters": res["final_clusters"],
        "step_snapshots": res["steps"]
    })
    return res

def run_experiment_em(exp_id: str, n_components: int, covariance_type: str, max_iter: int, tol: float, random_state: int) -> Dict[str, Any]:
    X, feature_names, _ = get_experiment_data(exp_id)
    res = run_em_step_by_step(X, n_components=n_components, covariance_type=covariance_type, max_iter=max_iter, tol=tol, random_state=random_state)

    run_id = str(uuid.uuid4())
    res["run_id"] = run_id
    res["experiment_id"] = exp_id

    db_client.save_experiment_run({
        "id": run_id,
        "experiment_id": exp_id,
        "algorithm_type": "em",
        "hyperparameters": res["hyperparameters"],
        "total_iterations": res["total_iterations"],
        "converged": res["converged"],
        "execution_time_ms": res["execution_time_ms"],
        "silhouette_score": res["metrics"].get("silhouette_score"),
        "davies_bouldin_index": res["metrics"].get("davies_bouldin_index"),
        "calinski_harabasz_index": res["metrics"].get("calinski_harabasz_index"),
        "num_clusters_found": res["metrics"]["num_clusters"],
        "num_noise_points": res["metrics"].get("num_noise_points", 0),
        "final_clusters": res["final_clusters"],
        "step_snapshots": res["steps"]
    })
    return res

def run_experiment_dbscan(exp_id: str, eps: float, min_samples: int, metric: str) -> Dict[str, Any]:
    X, feature_names, _ = get_experiment_data(exp_id)
    res = run_dbscan_step_by_step(X, eps=eps, min_samples=min_samples, metric=metric)

    run_id = str(uuid.uuid4())
    res["run_id"] = run_id
    res["experiment_id"] = exp_id

    db_client.save_experiment_run({
        "id": run_id,
        "experiment_id": exp_id,
        "algorithm_type": "dbscan",
        "hyperparameters": res["hyperparameters"],
        "total_iterations": res["total_iterations"],
        "converged": res["converged"],
        "execution_time_ms": res["execution_time_ms"],
        "silhouette_score": res["metrics"].get("silhouette_score"),
        "davies_bouldin_index": res["metrics"].get("davies_bouldin_index"),
        "calinski_harabasz_index": res["metrics"].get("calinski_harabasz_index"),
        "num_clusters_found": res["metrics"]["num_clusters"],
        "num_noise_points": res["metrics"].get("num_noise_points", 0),
        "final_clusters": res["final_clusters"],
        "step_snapshots": res["steps"]
    })
    return res

def get_detailed_evaluation(exp_id: str, labels: List[int]) -> Dict[str, Any]:
    X, _, _ = get_experiment_data(exp_id)
    return compute_detailed_silhouette_analysis(X, np.array(labels))
