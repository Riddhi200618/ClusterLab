import numpy as np
from typing import Dict, Any, List, Optional
from sklearn.metrics import (
    silhouette_score,
    silhouette_samples,
    davies_bouldin_score,
    calinski_harabasz_score
)

def compute_clustering_metrics(X: np.ndarray, labels: np.ndarray) -> Dict[str, Any]:
    labels = np.array(labels)
    unique_labels = set(labels)
    non_noise_mask = labels != -1
    non_noise_labels = labels[non_noise_mask]
    non_noise_X = X[non_noise_mask]

    unique_clusters = set(non_noise_labels)
    num_clusters = len(unique_clusters)
    num_noise = int(np.sum(~non_noise_mask))
    n_samples = len(labels)

    metrics = {
        "num_clusters": num_clusters,
        "num_noise_points": num_noise,
        "noise_ratio": round(num_noise / n_samples, 4) if n_samples > 0 else 0.0,
        "silhouette_score": None,
        "davies_bouldin_index": None,
        "calinski_harabasz_index": None,
        "cluster_counts": {str(k): int(np.sum(labels == k)) for k in sorted(list(unique_labels))}
    }

    # Clustering evaluation requires at least 2 distinct clusters and at least 1 sample per cluster
    if num_clusters >= 2 and len(non_noise_X) > num_clusters:
        try:
            sil = silhouette_score(non_noise_X, non_noise_labels)
            metrics["silhouette_score"] = round(float(sil), 4)
        except Exception:
            metrics["silhouette_score"] = None

        try:
            db = davies_bouldin_score(non_noise_X, non_noise_labels)
            metrics["davies_bouldin_index"] = round(float(db), 4)
        except Exception:
            metrics["davies_bouldin_index"] = None

        try:
            ch = calinski_harabasz_score(non_noise_X, non_noise_labels)
            metrics["calinski_harabasz_index"] = round(float(ch), 4)
        except Exception:
            metrics["calinski_harabasz_index"] = None

    return metrics

def compute_detailed_silhouette_analysis(X: np.ndarray, labels: np.ndarray) -> Dict[str, Any]:
    labels = np.array(labels)
    non_noise_mask = labels != -1
    non_noise_labels = labels[non_noise_mask]
    non_noise_X = X[non_noise_mask]

    unique_clusters = sorted(list(set(non_noise_labels)))
    num_clusters = len(unique_clusters)

    if num_clusters < 2 or len(non_noise_X) <= num_clusters:
        return {
            "overall_score": None,
            "per_cluster_scores": {},
            "cluster_sizes": {str(k): int(np.sum(labels == k)) for k in set(labels)},
            "samples": [],
            "verdict": "Indeterminate",
            "explanation": "Silhouette score requires at least 2 non-noise clusters to evaluate inter-cluster separation vs intra-cluster cohesion."
        }

    overall = float(silhouette_score(non_noise_X, non_noise_labels))
    sample_scores = silhouette_samples(non_noise_X, non_noise_labels)

    per_cluster = {}
    cluster_sizes = {}
    samples_list = []

    for c in unique_clusters:
        c_mask = non_noise_labels == c
        c_samples = sample_scores[c_mask]
        per_cluster[str(c)] = round(float(np.mean(c_samples)), 4) if len(c_samples) > 0 else 0.0
        cluster_sizes[str(c)] = int(np.sum(c_mask))

        # Sort samples within cluster for proper silhouette plot rendering
        sorted_indices = np.argsort(c_samples)
        non_noise_orig_indices = np.where(non_noise_mask)[0]
        c_orig_indices = non_noise_orig_indices[c_mask][sorted_indices]
        sorted_scores = c_samples[sorted_indices]

        for orig_idx, score in zip(c_orig_indices, sorted_scores):
            samples_list.append({
                "sample_index": int(orig_idx),
                "cluster_id": int(c),
                "silhouette_value": round(float(score), 4),
                "point_coord": [round(float(v), 4) for v in X[orig_idx][:2]]
            })

    # Educational verdict explanation
    if overall > 0.70:
        verdict = "Strong Separation"
        explanation = f"Silhouette score of {overall:.3f} indicates dense, well-separated clusters with minimal sample overlap."
    elif overall > 0.50:
        verdict = "Reasonable Structure"
        explanation = f"Silhouette score of {overall:.3f} indicates clear cluster groupings, with moderate boundary confidence."
    elif overall > 0.25:
        verdict = "Weak / Overlapping"
        explanation = f"Silhouette score of {overall:.3f} indicates artificial cluster boundaries or significant overlap between groups."
    else:
        verdict = "Poor / No Structure"
        explanation = f"Silhouette score of {overall:.3f} indicates that samples are closer to neighboring clusters than their assigned cluster."

    return {
        "overall_score": round(overall, 4),
        "per_cluster_scores": per_cluster,
        "cluster_sizes": cluster_sizes,
        "samples": samples_list,
        "verdict": verdict,
        "explanation": explanation
    }
