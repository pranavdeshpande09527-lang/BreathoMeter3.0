"""
Application configuration via environment variables.
All secrets sourced from environment — never hardcoded.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ─── App ──────────────────────────────────────────────────
    PYTHON_ENV: str = "development"
    ALLOWED_HOSTS: List[str] = ["*"]

    # ─── CORS ─────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # ─── Redis ────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379"
    AQI_CACHE_TTL_SECONDS: int = 300  # 5 minutes

    # ─── ML Model ─────────────────────────────────────────────
    ML_MODEL_PATH: str = "../ml/models/ensemble.onnx"
    SCALER_PATH: str = "../ml/models/scaler.pkl"

    # ─── AQI APIs ─────────────────────────────────────────────
    OPENWEATHER_API_KEY: str = ""
    WAQI_API_KEY: str = ""
    AQI_REQUEST_TIMEOUT: int = 10  # seconds

    # ─── Supabase ─────────────────────────────────────────────
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # ─── Stripe ───────────────────────────────────────────────
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # ─── JWT ──────────────────────────────────────────────────
    JWT_SECRET: str = "changeme-minimum-32-chars-xxxxxxxxx"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
