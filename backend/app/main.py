"""
BreathoMeter3.0 — FastAPI Application Entry Point
Thread-safe ONNX model loading at startup.
"""
from contextlib import asynccontextmanager
import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.api.routes import health, analyze, users, subscriptions
from app.services.ml_service import MLService
from app.services.redis_service import RedisService

logger = structlog.get_logger()

# ─── Global service instances ────────────────────────────────
ml_service: MLService | None = None
redis_service: RedisService | None = None

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: load model once at startup, cleanup on shutdown."""
    global ml_service, redis_service

    logger.info("🫁 BreathoMeter starting up...")

    # Initialize Redis
    redis_service = RedisService(settings.REDIS_URL)
    await redis_service.connect()
    logger.info("✅ Redis connected")

    # Load ONNX model (thread-safe, once at startup)
    ml_service = MLService(
        model_path=settings.ML_MODEL_PATH,
        scaler_path=settings.SCALER_PATH,
    )
    ml_service.load()
    logger.info("✅ ONNX ensemble model loaded")

    # Inject services into app state
    app.state.ml_service = ml_service
    app.state.redis_service = redis_service

    logger.info("🚀 BreathoMeter API ready")
    yield

    # Shutdown
    if redis_service:
        await redis_service.disconnect()
    logger.info("👋 BreathoMeter shutting down")


app = FastAPI(
    title="BreathoMeter API",
    description="AI-Native Respiratory Risk Intelligence Platform",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── Rate Limiting ────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ─── Trusted Hosts ────────────────────────────────────────────
if settings.PYTHON_ENV == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )

# ─── Routers ──────────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(analyze.router, prefix="/api", tags=["AI Inference"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["Subscriptions"])
