from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class DBSCANRunRequest(BaseModel):
    experiment_id: str
    eps: float = Field(0.5, ge=0.01, le=10.0)
    min_samples: int = Field(5, ge=1, le=50)
    metric: str = Field("euclidean", description="euclidean or manhattan")

class DBSCANStepSnapshot(BaseModel):
    step_index: int
    phase: str  # 'init', 'point_query', 'core_expand', 'border_noise_label', 'complete'
    phase_name: str
    current_point_idx: Optional[int] = None
    current_point_coord: Optional[List[float]] = None
    current_point_type: Optional[str] = None  # 'unvisited', 'core', 'border', 'noise'
    neighborhood_indices: Optional[List[int]] = None
    active_cluster_id: Optional[int] = None
    cluster_labels: List[int]  # -1 for noise / unassigned
    point_types: List[str]      # ['unvisited', 'core', 'border', 'noise'] for every point
    queue_indices: List[int]    # Points currently in BFS queue
    math_formula: str
    explanation: str

class DBSCANRunResponse(BaseModel):
    run_id: str
    experiment_id: str
    algorithm_type: str = "dbscan"
    hyperparameters: Dict[str, Any]
    total_iterations: int
    converged: bool = True
    execution_time_ms: float
    metrics: Dict[str, Any]
    final_clusters: List[int]
    steps: List[DBSCANStepSnapshot]
