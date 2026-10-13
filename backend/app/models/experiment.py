from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ExperimentCreateRequest(BaseModel):
    title: str = Field("Clustering Experiment", max_length=150)
    session_id: str = Field("guest_student", max_length=100)
    dataset_slug: str
    selected_features: List[str]
    scaling_method: str = Field("standard", description="none, standard, minmax")
    custom_synthetic_params: Optional[Dict[str, Any]] = None

class ExperimentResponse(BaseModel):
    id: str
    title: str
    session_id: str
    dataset_slug: str
    selected_features: List[str]
    scaling_method: str
    sample_size: int
    raw_points: List[List[float]]
    preprocessed_points: List[List[float]]
    feature_names: List[str]
    created_at: str
