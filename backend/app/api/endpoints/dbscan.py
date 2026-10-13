from fastapi import APIRouter, HTTPException
from backend.app.models.dbscan import DBSCANRunRequest, DBSCANRunResponse
from backend.app.services.experiment_service import run_experiment_dbscan

router = APIRouter()

@router.post("/run", response_model=DBSCANRunResponse)
def execute_dbscan(req: DBSCANRunRequest):
    """Run educational DBSCAN simulation tracking spatial queries, core/border/noise points, and BFS cluster expansion."""
    try:
        res = run_experiment_dbscan(
            exp_id=req.experiment_id,
            eps=req.eps,
            min_samples=req.min_samples,
            metric=req.metric
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
