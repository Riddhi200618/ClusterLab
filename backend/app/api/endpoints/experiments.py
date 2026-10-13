from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backend.app.models.experiment import ExperimentCreateRequest, ExperimentResponse
from backend.app.services.experiment_service import create_experiment
from backend.app.core.database import db_client

router = APIRouter()

@router.post("", response_model=ExperimentResponse)
def create_new_experiment(req: ExperimentCreateRequest):
    """Initialize a new clustering experiment with chosen dataset, features, and scaling."""
    try:
        return create_experiment(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history")
def get_experiment_history(
    session_id: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100)
):
    """Retrieve saved student experiments and runs from database."""
    return db_client.get_history(session_id=session_id, limit=limit)

@router.get("/{experiment_id}")
def get_experiment(experiment_id: str):
    """Get single experiment by ID."""
    exp = db_client.get_experiment(experiment_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    exp["runs"] = db_client.get_experiment_runs(experiment_id)
    return exp
