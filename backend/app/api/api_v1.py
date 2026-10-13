from fastapi import APIRouter
from backend.app.api.endpoints import datasets, experiments, kmeans, em, dbscan, comparison

api_router = APIRouter()

api_router.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
api_router.include_router(experiments.router, prefix="/experiments", tags=["experiments"])
api_router.include_router(kmeans.router, prefix="/algorithms/kmeans", tags=["kmeans"])
api_router.include_router(em.router, prefix="/algorithms/em", tags=["em"])
api_router.include_router(dbscan.router, prefix="/algorithms/dbscan", tags=["dbscan"])
api_router.include_router(comparison.router, prefix="/evaluation", tags=["evaluation"])
