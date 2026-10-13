from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class KMeansRunRequest(BaseModel):
    experiment_id: str
    k: int = Field(3, ge=1, le=10)
    init_method: str = Field("k-means++", description="random or k-means++")
    max_iter: int = Field(50, ge=1, le=100)
    tol: float = Field(1e-4, ge=1e-6, le=1.0)
    random_state: int = Field(42, ge=0, le=10000)

class KMeansStepSnapshot(BaseModel):
    step_index: int
    iteration: int
    phase: str  # 'init', 'distance_calc', 'assignment', 'centroid_update', 'convergence'
    phase_name: str
    centroids: List[List[float]]
    previous_centroids: Optional[List[List[float]]] = None
    centroid_shifts: Optional[List[float]] = None
    assignments: List[int]
    wcss: float
    delta_wcss: Optional[float] = None
    converged: bool
    math_formula: str
    explanation: str

class KMeansRunResponse(BaseModel):
    run_id: str
    experiment_id: str
    algorithm_type: str = "kmeans"
    hyperparameters: Dict[str, Any]
    total_iterations: int
    converged: bool
    execution_time_ms: float
    metrics: Dict[str, Any]
    final_clusters: List[int]
    steps: List[KMeansStepSnapshot]
