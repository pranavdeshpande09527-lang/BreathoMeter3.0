"""
POST /analyze-air — Core AI inference endpoint.
Orchestrates: AQI fetch → feature engineering → ONNX inference → confidence → SHAP.
"""
import structlog
from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.schemas import AirAnalysisRequest, AirAnalysisResponse, RiskCategory
from app.services.aqi_service import AQIService
from app.services.feature_service import FeatureEngineeringService
from app.services.shap_service import SHAPService

router = APIRouter()
logger = structlog.get_logger()
limiter = Limiter(key_func=get_remote_address)
aqi_service = AQIService()
feature_service = FeatureEngineeringService()
shap_service = SHAPService()


def _classify_risk(probability: float) -> RiskCategory:
    """Map calibrated ML probability to risk category."""
    if probability < 0.25:
        return RiskCategory.LOW
    elif probability < 0.50:
        return RiskCategory.MODERATE
    elif probability < 0.75:
        return RiskCategory.HIGH
    else:
        return RiskCategory.SEVERE


@router.post("/analyze-air", response_model=AirAnalysisResponse)
@limiter.limit("20/minute")
async def analyze_air(
    request: Request,
    body: AirAnalysisRequest,
) -> AirAnalysisResponse:
    """
    Primary AI inference endpoint.
    Fuses live AQI data with ensemble ML model to produce
    calibrated respiratory disease risk probability.
    """
    ml_service = request.app.state.ml_service
    redis_service = request.app.state.redis_service

    if not ml_service or not ml_service.is_loaded():
        raise HTTPException(
            status_code=503,
            detail="ML model not yet loaded. Please retry in a moment."
        )

    logger.info("analyze_air.request", city=body.city, age=body.age)

    # ─── Step 1: Fetch live AQI data (Redis cached) ──────────
    aqi_data = await aqi_service.fetch(
        city=body.city,
        redis_service=redis_service,
    )

    # ─── Step 2: Feature Engineering ─────────────────────────
    features = feature_service.build_features(
        pm25=aqi_data.pm25,
        pm10=aqi_data.pm10,
        aqi=aqi_data.aqi,
        age=body.age,
        exposure_hours=body.exposure_hours,
        smoking=body.smoking,
        pre_existing_condition=body.pre_existing_condition,
    )

    # ─── Step 3: ONNX Ensemble Inference ─────────────────────
    inference_result = ml_service.predict(features)
    probability = float(inference_result["probability"])
    model_probabilities = inference_result["individual_probs"]

    # ─── Step 4: Confidence Scoring ──────────────────────────
    import numpy as np
    variance = float(np.var(model_probabilities))
    # High variance = low confidence; normalize to 0–1
    confidence = float(max(0.0, min(1.0, 1.0 - (variance * 10))))

    # ─── Step 5: SHAP Explainability ─────────────────────────
    top_factor = shap_service.top_factor(features)

    # ─── Step 6: Risk Classification ─────────────────────────
    risk_category = _classify_risk(probability)

    logger.info(
        "analyze_air.response",
        city=body.city,
        risk=risk_category,
        probability=probability,
        confidence=confidence,
    )

    return AirAnalysisResponse(
        aqi=aqi_data.aqi,
        pm25=aqi_data.pm25,
        pm10=aqi_data.pm10,
        ml_disease_risk_probability=round(probability, 4),
        risk_category=risk_category,
        confidence_score=round(confidence, 4),
        top_risk_factor=top_factor,
        data_source=aqi_data.source,
    )
