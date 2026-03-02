"""
Pydantic v2 request/response schemas.
All API contracts defined here — never inline.
"""
from pydantic import BaseModel, Field, field_validator
from enum import Enum


class RiskCategory(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    SEVERE = "Severe"


class AirAnalysisRequest(BaseModel):
    """POST /analyze-air request body."""
    city: str = Field(..., min_length=1, max_length=100, example="Pune")
    age: int = Field(..., ge=1, le=120, example=21)
    exposure_hours: float = Field(..., ge=0, le=24, example=4.0)
    smoking: int = Field(..., ge=0, le=1, example=0, description="1=smoker, 0=non-smoker")
    pre_existing_condition: int = Field(
        ..., ge=0, le=1, example=0,
        description="1=has respiratory condition, 0=none"
    )

    @field_validator("city")
    @classmethod
    def sanitize_city(cls, v: str) -> str:
        return v.strip().title()


class AirAnalysisResponse(BaseModel):
    """POST /analyze-air response body — stable contract."""
    aqi: float = Field(..., description="Air Quality Index")
    pm25: float = Field(..., description="PM2.5 concentration (μg/m³)")
    pm10: float = Field(..., description="PM10 concentration (μg/m³)")
    ml_disease_risk_probability: float = Field(
        ..., ge=0, le=1, description="Calibrated disease risk probability"
    )
    risk_category: RiskCategory = Field(..., description="Risk level classification")
    confidence_score: float = Field(
        ..., ge=0, le=1, description="Ensemble confidence score"
    )
    top_risk_factor: str = Field(..., description="Primary SHAP-identified risk factor")
    data_source: str = Field(default="OpenWeather + WAQI fusion")


class AQIRawData(BaseModel):
    """Internal model for fused AQI API data."""
    aqi: float
    pm25: float
    pm10: float
    city: str
    source: str
    cache_hit: bool = False


class HealthResponse(BaseModel):
    status: str
    version: str
    model_loaded: bool
    redis_connected: bool


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str | None = None
    subscription_tier: str = "free"


class StripeCheckoutRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str


class StripeCheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
