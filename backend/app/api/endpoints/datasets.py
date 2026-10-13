from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backend.app.models.dataset import DatasetMeta, DatasetDetail, SyntheticGenerateRequest
from backend.app.services.dataset_service import list_all_datasets, get_dataset_details, generate_synthetic_dataset

router = APIRouter()

@router.get("", response_model=List[DatasetMeta])
def get_datasets():
    """List all available datasets (real-world and synthetic presets)."""
    return list_all_datasets()

@router.get("/{slug}", response_model=DatasetDetail)
def get_dataset(
    slug: str,
    n_samples: Optional[int] = Query(None),
    noise: Optional[float] = Query(None),
    centers: Optional[int] = Query(None),
    cluster_std: Optional[float] = Query(None),
    random_state: Optional[int] = Query(None)
):
    """Get complete records, preview data, and statistics for a dataset."""
    params = {}
    if n_samples is not None: params["n_samples"] = n_samples
    if noise is not None: params["noise"] = noise
    if centers is not None: params["centers"] = centers
    if cluster_std is not None: params["cluster_std"] = cluster_std
    if random_state is not None: params["random_state"] = random_state

    try:
        return get_dataset_details(slug, params if params else None)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/synthetic/generate", response_model=DatasetDetail)
def generate_synthetic(req: SyntheticGenerateRequest):
    """Generate on-demand custom synthetic dataset."""
    slug = f"synthetic_{req.dataset_type}"
    params = req.model_dump()
    try:
        return get_dataset_details(slug, params)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
