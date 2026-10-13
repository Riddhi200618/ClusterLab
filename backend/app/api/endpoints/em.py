from fastapi import APIRouter, HTTPException
from backend.app.models.em import EMRunRequest, EMRunResponse
from backend.app.services.experiment_service import run_experiment_em

router = APIRouter()

@router.post("/run", response_model=EMRunResponse)
def execute_em(req: EMRunRequest):
    """Run educational Expectation Maximization (GMM) simulation with Gaussian ellipsoids and soft responsibilities."""
    try:
        res = run_experiment_em(
            exp_id=req.experiment_id,
            n_components=req.n_components,
            covariance_type=req.covariance_type,
            max_iter=req.max_iter,
            tol=req.tol,
            random_state=req.random_state
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
