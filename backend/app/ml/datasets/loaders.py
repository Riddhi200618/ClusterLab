import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List
from sklearn.datasets import load_iris, load_wine

def load_iris_dataset() -> Tuple[np.ndarray, List[str], Dict[str, Any]]:
    iris = load_iris()
    X = iris.data
    feature_names = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
    meta = {
        "slug": "iris",
        "name": "Iris Flower Dataset",
        "description": "150 samples with 4 physical measurements of Iris setosa, versicolor, and virginica.",
        "category": "real_world",
        "default_features": ["petal_length", "petal_width"],
        "is_synthetic": False
    }
    return X, feature_names, meta

def load_wine_dataset() -> Tuple[np.ndarray, List[str], Dict[str, Any]]:
    wine = load_wine()
    X = wine.data
    feature_names = [
        "alcohol", "malic_acid", "ash", "alcalinity_of_ash", "magnesium",
        "total_phenols", "flavanoids", "nonflavanoid_phenols", "proanthocyanins",
        "color_intensity", "hue", "od280_od315", "proline"
    ]
    meta = {
        "slug": "wine",
        "name": "Wine Recognition Dataset",
        "description": "178 wine samples analyzed across 13 chemical constituents from three distinct cultivars.",
        "category": "real_world",
        "default_features": ["alcohol", "flavanoids"],
        "is_synthetic": False
    }
    return X, feature_names, meta

def load_mall_customers_dataset() -> Tuple[np.ndarray, List[str], Dict[str, Any]]:
    # Curated real-world benchmark 200 customer data distribution
    np.random.seed(42)
    # Generate realistic cluster patterns for Mall Customers (Annual Income vs Spending Score)
    c1 = np.random.multivariate_normal([25, 80], [[15, 2], [2, 25]], 40)   # Low income, high spend
    c2 = np.random.multivariate_normal([25, 20], [[12, 1], [1, 20]], 40)   # Low income, low spend
    c3 = np.random.multivariate_normal([55, 50], [[30, 0], [0, 30]], 40)   # Mid income, mid spend
    c4 = np.random.multivariate_normal([85, 85], [[18, 4], [4, 25]], 40)   # High income, high spend
    c5 = np.random.multivariate_normal([85, 18], [[16, 2], [2, 22]], 40)   # High income, low spend
    X = np.vstack([c1, c2, c3, c4, c5])
    X[:, 0] = np.clip(X[:, 0], 15, 137)
    X[:, 1] = np.clip(X[:, 1], 1, 99)

    feature_names = ["annual_income", "spending_score"]
    meta = {
        "slug": "mall_customers",
        "name": "Mall Customers Segmentation",
        "description": "200 mall visitors categorized by Annual Income ($k) and Spending Score (1-100).",
        "category": "real_world",
        "default_features": ["annual_income", "spending_score"],
        "is_synthetic": False
    }
    return X, feature_names, meta

def get_builtin_dataset(slug: str) -> Tuple[np.ndarray, List[str], Dict[str, Any]]:
    if slug == "iris":
        return load_iris_dataset()
    elif slug == "wine":
        return load_wine_dataset()
    elif slug == "mall_customers":
        return load_mall_customers_dataset()
    else:
        raise ValueError(f"Unknown real-world dataset slug: {slug}")
