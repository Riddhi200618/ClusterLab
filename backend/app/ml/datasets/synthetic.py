import numpy as np
from typing import Dict, Any, Tuple, List
from sklearn.datasets import make_blobs, make_moons, make_circles

def generate_synthetic_dataset(
    dataset_type: str = "blobs",
    n_samples: int = 300,
    noise: float = 0.08,
    centers: int = 3,
    cluster_std: float = 0.8,
    random_state: int = 42
) -> Tuple[np.ndarray, List[str], Dict[str, Any]]:
    dataset_type = dataset_type.lower()

    if dataset_type == "blobs":
        X, y = make_blobs(
            n_samples=n_samples,
            n_features=2,
            centers=centers,
            cluster_std=cluster_std,
            random_state=random_state
        )
        meta = {
            "slug": "synthetic_blobs",
            "name": "Synthetic Gaussian Blobs",
            "description": f"Isotropic Gaussian clusters (K={centers}) ideal for testing spherical clustering assumptions.",
            "category": "synthetic",
            "default_features": ["feature_1", "feature_2"],
            "is_synthetic": True,
            "params": {"centers": centers, "cluster_std": cluster_std, "n_samples": n_samples, "random_state": random_state}
        }
    elif dataset_type == "moons":
        X, y = make_moons(
            n_samples=n_samples,
            noise=noise,
            random_state=random_state
        )
        meta = {
            "slug": "synthetic_moons",
            "name": "Synthetic Two Moons",
            "description": f"Interlocking non-linear crescent shapes designed to demonstrate where density-based clustering outperforms distance centroids.",
            "category": "synthetic",
            "default_features": ["feature_1", "feature_2"],
            "is_synthetic": True,
            "params": {"noise": noise, "n_samples": n_samples, "random_state": random_state}
        }
    elif dataset_type == "circles":
        X, y = make_circles(
            n_samples=n_samples,
            noise=noise,
            factor=0.5,
            random_state=random_state
        )
        meta = {
            "slug": "synthetic_circles",
            "name": "Synthetic Concentric Circles",
            "description": f"Nested circular manifolds demonstrating non-convex cluster boundary discovery.",
            "category": "synthetic",
            "default_features": ["feature_1", "feature_2"],
            "is_synthetic": True,
            "params": {"noise": noise, "factor": 0.5, "n_samples": n_samples, "random_state": random_state}
        }
    else:
        raise ValueError(f"Unknown synthetic dataset type: {dataset_type}")

    feature_names = ["feature_1", "feature_2"]
    return X, feature_names, meta
