from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class DatasetMeta(BaseModel):
    id: Optional[str] = None
    slug: str
    name: str
    description: str
    category: str = "real_world"
    sample_count: int
    feature_count: int
    feature_names: List[str]
    default_features: List[str]
    is_synthetic: bool = False

class FeatureSummary(BaseModel):
    feature_name: str
    mean: float
    std: float
    min: float
    max: float

class DatasetDetail(DatasetMeta):
    data: List[Dict[str, Any]]
    statistics: List[FeatureSummary]

class SyntheticGenerateRequest(BaseModel):
    dataset_type: str = Field("blobs", description="blobs, moons, circles")
    n_samples: int = Field(300, ge=50, le=1000)
    noise: float = Field(0.08, ge=0.0, le=1.0)
    centers: int = Field(3, ge=2, le=8)
    cluster_std: float = Field(0.8, ge=0.1, le=3.0)
    random_state: int = Field(42, ge=0, le=10000)
