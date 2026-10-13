from fastapi import APIRouter, HTTPException
from backend.app.models.kmeans import KMeansRunRequest, KMeansRunResponse
from backend.app.services.experiment_service import run_experiment_kmeans

router = APIRouter()

@router.post("/run", response_model=KMeansRunResponse)
def execute_kmeans(req: KMeansRunRequest):
    """Run educational step-by-step K-Means simulation and return all iteration snapshots."""
    try:
        res = run_experiment_kmeans(
            exp_id=req.experiment_id,
            k=req.k,
            init_method=req.init_method,
            max_iter=req.max_iter,
            tol=req.tol,
            random_state=req.random_state
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
