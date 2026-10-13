from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SilhouetteSample(BaseModel):
    sample_index: int
    cluster_id: int
    silhouette_value: float
    point_coord: List[float]

class SilhouetteEvaluationResponse(BaseModel):
    overall_score: Optional[float]
    per_cluster_scores: Dict[str, float]
    cluster_sizes: Dict[str, int]
    samples: List[SilhouetteSample]
    verdict: str
    explanation: str

class ComparisonRequest(BaseModel):
    experiment_id: str
    run_ids: Optional[List[str]] = None

class AlgorithmMetricComparison(BaseModel):
    algorithm_type: str
    algorithm_name: str
    run_id: str
    silhouette_score: Optional[float]
    davies_bouldin_index: Optional[float]
    calinski_harabasz_index: Optional[float]
    num_clusters: int
    num_noise_points: int
    execution_time_ms: float
    hyperparameters: Dict[str, Any]

class ComparisonResponse(BaseModel):
    experiment_id: str
    dataset_slug: str
    comparison_table: List[AlgorithmMetricComparison]
    winner_algorithm: str
    educational_summary: str
