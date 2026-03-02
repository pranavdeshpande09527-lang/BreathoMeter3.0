"""Health check route."""
from fastapi import APIRouter, Request
from app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(request: Request) -> HealthResponse:
    ml_loaded = False
    redis_ok = False

    if hasattr(request.app.state, "ml_service") and request.app.state.ml_service:
        ml_loaded = request.app.state.ml_service.is_loaded()

    if hasattr(request.app.state, "redis_service") and request.app.state.redis_service:
        redis_ok = await request.app.state.redis_service.ping()

    return HealthResponse(
        status="ok",
        version="3.0.0",
        model_loaded=ml_loaded,
        redis_connected=redis_ok,
    )
