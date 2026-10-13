from fastapi import APIRouter, HTTPException, Body
from typing import List, Optional
from backend.app.models.evaluation import ComparisonRequest, ComparisonResponse, SilhouetteEvaluationResponse
from backend.app.services.comparison_service import run_or_get_comparison
from backend.app.services.experiment_service import get_detailed_evaluation

router = APIRouter()

@router.post("/compare", response_model=ComparisonResponse)
def compare_algorithms(req: ComparisonRequest):
    """Execute and compare K-Means, EM, and DBSCAN on identical preprocessed data matrix."""
    try:
        return run_or_get_comparison(req.experiment_id, req.run_ids)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/silhouette", response_model=SilhouetteEvaluationResponse)
def evaluate_silhouette(
    experiment_id: str = Body(..., embed=True),
    labels: List[int] = Body(..., embed=True)
):
    """Calculate detailed per-sample Silhouette coefficients for silhouette plot visualization."""
    try:
        return get_detailed_evaluation(experiment_id, labels)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
