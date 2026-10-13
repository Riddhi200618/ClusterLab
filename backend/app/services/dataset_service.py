import logging
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional, Tuple
from backend.app.core.database import db_client
from backend.app.ml.datasets.loaders import get_builtin_dataset
from backend.app.ml.datasets.synthetic import generate_synthetic_dataset
from backend.app.models.dataset import DatasetMeta, DatasetDetail, FeatureSummary, SyntheticGenerateRequest

logger = logging.getLogger("clusterlab.datasets")

# In-memory cached raw matrices
DATASET_CACHE: Dict[str, Dict[str, Any]] = {}

def get_or_load_dataset(slug: str, synthetic_params: Optional[Dict[str, Any]] = None) -> Tuple[np.ndarray, List[str], Dict[str, Any]]:
    cache_key = slug
    if slug.startswith("synthetic_") and synthetic_params:
        cache_key = f"{slug}_{hash(frozenset(synthetic_params.items()))}"

    if cache_key in DATASET_CACHE:
        cached = DATASET_CACHE[cache_key]
        return cached["X"], cached["feature_names"], cached["meta"]

    if slug in ["iris", "wine", "mall_customers"]:
        X, feature_names, meta = get_builtin_dataset(slug)
    elif slug.startswith("synthetic_"):
        dtype = slug.replace("synthetic_", "")
        params = synthetic_params or {}
        X, feature_names, meta = generate_synthetic_dataset(
            dataset_type=dtype,
            n_samples=params.get("n_samples", 300),
            noise=params.get("noise", 0.08),
            centers=params.get("centers", 3),
            cluster_std=params.get("cluster_std", 0.8),
            random_state=params.get("random_state", 42)
        )
    else:
        raise ValueError(f"Unsupported dataset slug: {slug}")

    DATASET_CACHE[cache_key] = {
        "X": X,
        "feature_names": feature_names,
        "meta": meta
    }
    return X, feature_names, meta

def list_all_datasets() -> List[DatasetMeta]:
    defaults = [
        DatasetMeta(
            slug="iris",
            name="Iris Flower Dataset",
            description="Classic dataset with 150 samples across 4 features: sepal & petal length/width.",
            category="real_world",
            sample_count=150,
            feature_count=4,
            feature_names=["sepal_length", "sepal_width", "petal_length", "petal_width"],
            default_features=["petal_length", "petal_width"],
            is_synthetic=False
        ),
        DatasetMeta(
            slug="mall_customers",
            name="Mall Customers Segmentation",
            description="200 mall customer records with Annual Income ($k) and Spending Score (1-100).",
            category="real_world",
            sample_count=200,
            feature_count=2,
            feature_names=["annual_income", "spending_score"],
            default_features=["annual_income", "spending_score"],
            is_synthetic=False
        ),
        DatasetMeta(
            slug="wine",
            name="Wine Recognition Dataset",
            description="178 Italian wine samples analyzed across 13 chemical features from 3 cultivars.",
            category="real_world",
            sample_count=178,
            feature_count=13,
            feature_names=[
                "alcohol", "malic_acid", "ash", "alcalinity_of_ash", "magnesium",
                "total_phenols", "flavanoids", "nonflavanoid_phenols", "proanthocyanins",
                "color_intensity", "hue", "od280_od315", "proline"
            ],
            default_features=["alcohol", "flavanoids"],
            is_synthetic=False
        ),
        DatasetMeta(
            slug="synthetic_blobs",
            name="Synthetic Gaussian Blobs",
            description="Isotropic spherical Gaussian clusters ideal for testing K-Means.",
            category="synthetic",
            sample_count=300,
            feature_count=2,
            feature_names=["feature_1", "feature_2"],
            default_features=["feature_1", "feature_2"],
            is_synthetic=True
        ),
        DatasetMeta(
            slug="synthetic_moons",
            name="Synthetic Two Moons",
            description="Two non-linear interleaving crescents showcasing DBSCAN's spatial density discovery.",
            category="synthetic",
            sample_count=300,
            feature_count=2,
            feature_names=["feature_1", "feature_2"],
            default_features=["feature_1", "feature_2"],
            is_synthetic=True
        ),
        DatasetMeta(
            slug="synthetic_circles",
            name="Synthetic Concentric Circles",
            description="Concentric circular rings demonstrating non-convex cluster boundaries.",
            category="synthetic",
            sample_count=300,
            feature_count=2,
            feature_names=["feature_1", "feature_2"],
            default_features=["feature_1", "feature_2"],
            is_synthetic=True
        ),
    ]

    try:
        rows = db_client.get_datasets()
        if rows:
            return [
                DatasetMeta(
                    id=str(row["id"]) if row.get("id") else None,
                    slug=row["slug"],
                    name=row["name"],
                    description=row["description"],
                    category=row.get("category", "real_world"),
                    sample_count=int(row["sample_count"]),
                    feature_count=int(row["feature_count"]),
                    feature_names=list(row.get("feature_names", [])),
                    default_features=list(row.get("default_features", [])),
                    is_synthetic=bool(row.get("is_synthetic", False)),
                )
                for row in rows
            ]
    except Exception as e:
        logger.warning(f"Error fetching datasets from database: {e}. Falling back to default datasets.")

    return defaults

def get_dataset_details(slug: str, synthetic_params: Optional[Dict[str, Any]] = None) -> DatasetDetail:
    X, feature_names, meta = get_or_load_dataset(slug, synthetic_params)

    # Calculate statistics
    stats = []
    for col_idx, col_name in enumerate(feature_names):
        col_data = X[:, col_idx]
        stats.append(FeatureSummary(
            feature_name=col_name,
            mean=round(float(np.mean(col_data)), 4),
            std=round(float(np.std(col_data)), 4),
            min=round(float(np.min(col_data)), 4),
            max=round(float(np.max(col_data)), 4)
        ))

    records = []
    for row in X:
        rec = {feature_names[i]: round(float(row[i]), 4) for i in range(len(feature_names))}
        records.append(rec)

    return DatasetDetail(
        slug=meta["slug"],
        name=meta["name"],
        description=meta["description"],
        category=meta["category"],
        sample_count=len(X),
        feature_count=len(feature_names),
        feature_names=feature_names,
        default_features=meta.get("default_features", feature_names[:2]),
        is_synthetic=meta.get("is_synthetic", False),
        data=records,
        statistics=stats
    )
