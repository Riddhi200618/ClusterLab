from typing import List, Dict, Any, Optional
from backend.app.core.database import db_client
from backend.app.services.experiment_service import (
    get_experiment_data,
    run_experiment_kmeans,
    run_experiment_em,
    run_experiment_dbscan
)
from backend.app.models.evaluation import ComparisonResponse, AlgorithmMetricComparison

def run_or_get_comparison(experiment_id: str, run_ids: Optional[List[str]] = None) -> ComparisonResponse:
    X, feature_names, dataset_slug = get_experiment_data(experiment_id)

    # Defaults for algorithm parameters based on dataset
    default_k = 2 if dataset_slug in ["synthetic_moons", "synthetic_circles"] else 3
    eps = 0.25 if dataset_slug in ["synthetic_moons", "synthetic_circles"] else 0.5
    min_samples = 5

    # Run all 3 algorithms to compare on the identical preprocessed matrix
    km_res = run_experiment_kmeans(experiment_id, k=default_k, init_method="k-means++", max_iter=50, tol=1e-4, random_state=42)
    em_res = run_experiment_em(experiment_id, n_components=default_k, covariance_type="full", max_iter=50, tol=1e-3, random_state=42)
    db_res = run_experiment_dbscan(experiment_id, eps=eps, min_samples=min_samples, metric="euclidean")

    comparisons: List[AlgorithmMetricComparison] = [
        AlgorithmMetricComparison(
            algorithm_type="kmeans",
            algorithm_name="K-Means (Partitioning)",
            run_id=km_res["run_id"],
            silhouette_score=km_res["metrics"].get("silhouette_score"),
            davies_bouldin_index=km_res["metrics"].get("davies_bouldin_index"),
            calinski_harabasz_index=km_res["metrics"].get("calinski_harabasz_index"),
            num_clusters=km_res["metrics"]["num_clusters"],
            num_noise_points=km_res["metrics"].get("num_noise_points", 0),
            execution_time_ms=km_res["execution_time_ms"],
            hyperparameters=km_res["hyperparameters"]
        ),
        AlgorithmMetricComparison(
            algorithm_type="em",
            algorithm_name="Expectation Maximization / GMM (Probabilistic)",
            run_id=em_res["run_id"],
            silhouette_score=em_res["metrics"].get("silhouette_score"),
            davies_bouldin_index=em_res["metrics"].get("davies_bouldin_index"),
            calinski_harabasz_index=em_res["metrics"].get("calinski_harabasz_index"),
            num_clusters=em_res["metrics"]["num_clusters"],
            num_noise_points=em_res["metrics"].get("num_noise_points", 0),
            execution_time_ms=em_res["execution_time_ms"],
            hyperparameters=em_res["hyperparameters"]
        ),
        AlgorithmMetricComparison(
            algorithm_type="dbscan",
            algorithm_name="DBSCAN (Density-Based)",
            run_id=db_res["run_id"],
            silhouette_score=db_res["metrics"].get("silhouette_score"),
            davies_bouldin_index=db_res["metrics"].get("davies_bouldin_index"),
            calinski_harabasz_index=db_res["metrics"].get("calinski_harabasz_index"),
            num_clusters=db_res["metrics"]["num_clusters"],
            num_noise_points=db_res["metrics"].get("num_noise_points", 0),
            execution_time_ms=db_res["execution_time_ms"],
            hyperparameters=db_res["hyperparameters"]
        )
    ]

    # Determine winner based on highest valid silhouette score
    valid_scores = [(c.algorithm_name, c.silhouette_score, c.algorithm_type) for c in comparisons if c.silhouette_score is not None]
    if valid_scores:
        winner_name, best_score, winner_type = max(valid_scores, key=lambda x: x[1])
    else:
        winner_name = "DBSCAN" if dataset_slug in ["synthetic_moons", "synthetic_circles"] else "K-Means"
        winner_type = "dbscan" if dataset_slug in ["synthetic_moons", "synthetic_circles"] else "kmeans"

    # Educational narrative summary
    if dataset_slug in ["synthetic_moons", "synthetic_circles"]:
        summary = (
            f"On non-linear manifold data ({dataset_slug.replace('_', ' ').title()}), distance-based methods like K-Means and EM struggle because they assume convex/spherical clusters. "
            f"DBSCAN excels by discovering density-connected components of arbitrary shapes without assuming spherical geometry."
        )
    elif dataset_slug == "synthetic_blobs":
        summary = (
            f"On isotropic Gaussian blobs, K-Means is extremely fast and effective. "
            f"EM models the underlying covariance accurately, while DBSCAN succeeds if density parameters (eps, MinPts) are tuned correctly."
        )
    else:
        summary = (
            f"On {dataset_slug.replace('_', ' ').title()}, {winner_name} achieved the most distinct cluster separation. "
            f"Review the trade-offs: K-Means minimizes spherical inertia; EM provides soft posterior probabilities; DBSCAN identifies outliers as noise."
        )

    response = ComparisonResponse(
        experiment_id=experiment_id,
        dataset_slug=dataset_slug,
        comparison_table=comparisons,
        winner_algorithm=winner_type,
        educational_summary=summary
    )

    # Persist comparison in database
    db_client.save_comparison({
        "experiment_id": experiment_id,
        "run_ids": [c.run_id for c in comparisons],
        "comparison_matrix": [c.model_dump() for c in comparisons],
        "winner_algorithm": winner_type,
        "educational_summary": summary
    })

    return response
