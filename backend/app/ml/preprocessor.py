import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from typing import Tuple, List, Optional

def preprocess_features(
    X: np.ndarray,
    scaling_method: str = "standard"
) -> np.ndarray:
    scaling_method = scaling_method.lower()
    if scaling_method == "standard":
        scaler = StandardScaler()
        return scaler.fit_transform(X)
    elif scaling_method == "minmax":
        scaler = MinMaxScaler()
        return scaler.fit_transform(X)
    elif scaling_method == "none":
        return X.copy()
    else:
        raise ValueError(f"Unknown scaling method: {scaling_method}")

def project_to_2d_if_needed(
    X: np.ndarray,
    feature_names: List[str],
    selected_features: Optional[List[str]] = None
) -> Tuple[np.ndarray, List[str]]:
    if selected_features and len(selected_features) >= 2:
        indices = [feature_names.index(f) for f in selected_features if f in feature_names]
        if len(indices) >= 2:
            return X[:, indices[:2]], [feature_names[i] for i in indices[:2]]

    if X.shape[1] > 2:
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X)
        return X_pca, ["PCA_Component_1", "PCA_Component_2"]

    return X, feature_names[:2]
