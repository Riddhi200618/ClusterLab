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

    n_samples = len(X)

    # Filter valid non-degenerate candidates:
    # 1. Must have valid silhouette score (requires num_clusters >= 2)
    # 2. Must form at least 2 clusters
    # 3. Must not discard majority of dataset as noise (noise_ratio < 0.5)
    valid_candidates = [
        c for c in comparisons
        if c.silhouette_score is not None
        and c.num_clusters >= 2
        and (c.num_noise_points / n_samples if n_samples > 0 else 0) < 0.5
    ]

    def ranking_key(c: AlgorithmMetricComparison):
        # Primary: Silhouette Score (higher is better)
        # Secondary / Tie-breaker: Davies-Bouldin Index (lower is better, negated for max sort)
        sil = c.silhouette_score if c.silhouette_score is not None else -999.0
        db_neg = -c.davies_bouldin_index if c.davies_bouldin_index is not None else -999.0
        return (round(sil, 4), round(db_neg, 4))

    if valid_candidates:
        if dataset_slug in ["synthetic_moons", "synthetic_circles"]:
            # On non-linear manifolds, DBSCAN is structurally the only manifold-aware paradigm;
            # if DBSCAN formed valid clusters with low noise, select it as the methodologically sound winner.
            db_cand = next((c for c in valid_candidates if c.algorithm_type == "dbscan" and c.num_clusters >= 2 and c.num_noise_points < n_samples * 0.2), None)
            winner_comp = db_cand if db_cand is not None else max(valid_candidates, key=ranking_key)
        else:
            winner_comp = max(valid_candidates, key=ranking_key)

        winner_name = winner_comp.algorithm_name
        winner_type = winner_comp.algorithm_type
    else:
        # Fallback when all algorithms degenerate or fail
        winner_type = "dbscan" if dataset_slug in ["synthetic_moons", "synthetic_circles"] else "kmeans"
        winner_name = next((c.algorithm_name for c in comparisons if c.algorithm_type == winner_type), "K-Means")
        winner_comp = next((c for c in comparisons if c.algorithm_type == winner_type), None)

    # Educational narrative summary
    if dataset_slug in ["synthetic_moons", "synthetic_circles"]:
        summary = (
            f"On non-linear manifold data ({dataset_slug.replace('_', ' ').title()}), distance-based methods like K-Means and EM struggle because they assume convex/spherical clusters. "
            f"DBSCAN excels by discovering density-connected components of arbitrary shapes without assuming spherical geometry. Note: Euclidean validation metrics like Silhouette inherently penalize non-convex clusters."
        )
    elif dataset_slug == "synthetic_blobs":
        summary = (
            f"On isotropic Gaussian blobs, K-Means is extremely fast and effective. "
            f"EM models the underlying covariance accurately, while DBSCAN succeeds if density parameters (eps, MinPts) are tuned correctly."
        )
    else:
        cluster_notes = []
        if winner_comp and winner_comp.algorithm_type == "dbscan":
            other_ks = [c.num_clusters for c in comparisons if c.algorithm_type != "dbscan"]
            if any(k != winner_comp.num_clusters for k in other_ks):
                cluster_notes.append(
                    f"Note that DBSCAN partitioned the dataset into {winner_comp.num_clusters} clusters (merging adjacent distributions) compared to {other_ks[0]} clusters for K-Means and EM, which yields a higher 2-cluster Silhouette score ({winner_comp.silhouette_score}) and lower Davies-Bouldin index ({winner_comp.davies_bouldin_index})."
                )
        summary_note = (" " + " ".join(cluster_notes)) if cluster_notes else ""
        summary = (
            f"On {dataset_slug.replace('_', ' ').title()}, {winner_name} achieved the most favorable cluster validation metrics (Silhouette: {winner_comp.silhouette_score if winner_comp else 'N/A'}, Davies-Bouldin: {winner_comp.davies_bouldin_index if winner_comp else 'N/A'}).{summary_note} "
            f"Review the trade-offs: K-Means minimizes spherical inertia; EM provides soft posterior probabilities; DBSCAN identifies arbitrary density shapes and isolates outliers as noise."
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
