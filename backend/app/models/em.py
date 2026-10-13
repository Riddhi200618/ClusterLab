from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class EMRunRequest(BaseModel):
    experiment_id: str
    n_components: int = Field(3, ge=1, le=10)
    covariance_type: str = Field("full", description="full, diag, spherical")
    max_iter: int = Field(50, ge=1, le=100)
    tol: float = Field(1e-3, ge=1e-6, le=1.0)
    random_state: int = Field(42, ge=0, le=10000)

class EllipseData(BaseModel):
    component_index: int
    mean: List[float]
    sigma_1_rx: float
    sigma_1_ry: float
    sigma_2_rx: float
    sigma_2_ry: float
    angle_deg: float

class EMStepSnapshot(BaseModel):
    step_index: int
    iteration: int
    phase: str  # 'init', 'e_step', 'm_step', 'log_likelihood', 'convergence'
    phase_name: str
    means: List[List[float]]
    weights: List[float]
    covariances: List[List[List[float]]]
    responsibilities: List[List[float]]  # N x K matrix for soft coloring
    hard_assignments: List[int]
    log_likelihood: float
    delta_log_likelihood: Optional[float] = None
    ellipses_2d: Optional[List[EllipseData]] = None
    converged: bool
    math_formula: str
    explanation: str

class EMRunResponse(BaseModel):
    run_id: str
    experiment_id: str
    algorithm_type: str = "em"
    hyperparameters: Dict[str, Any]
    total_iterations: int
    converged: bool
    execution_time_ms: float
    metrics: Dict[str, Any]
    final_clusters: List[int]
    steps: List[EMStepSnapshot]
