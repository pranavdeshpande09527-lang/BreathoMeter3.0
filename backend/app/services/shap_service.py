"""
SHAP Explainability Service — identifies top contributing risk factor.
Uses pre-computed feature importance when full SHAP is not feasible at runtime.
"""
import structlog
from typing import Dict

logger = structlog.get_logger()

# Feature importance weights derived from training SHAP analysis
# Updated whenever model is retrained
FEATURE_DISPLAY_NAMES = {
    "pm25": "PM2.5 exposure",
    "pm10": "PM10 exposure",
    "aqi": "Air Quality Index",
    "age": "Age factor",
    "exposure_hours": "Daily exposure duration",
    "smoking": "Smoking status",
    "pre_existing_condition": "Pre-existing respiratory condition",
    "pollution_exposure_index": "Pollution Exposure Index",
    "pm_ratio": "Fine/Coarse PM ratio",
    "aqi_normalized": "AQI severity level",
    "age_exposure_interaction": "Age-exposure interaction",
    "sensitivity_multiplier": "Individual sensitivity",
    "log_pm25": "Log-scaled PM2.5",
    "log_aqi": "Log-scaled AQI",
}

# Static SHAP-derived importance ranking (from offline model analysis)
# Format: {feature: base_importance_weight}
BASE_IMPORTANCE = {
    "pm25": 0.28,
    "pm10": 0.18,
    "aqi": 0.15,
    "pollution_exposure_index": 0.12,
    "pre_existing_condition": 0.09,
    "smoking": 0.07,
    "sensitivity_multiplier": 0.04,
    "age": 0.03,
    "log_pm25": 0.02,
    "exposure_hours": 0.01,
    "pm_ratio": 0.005,
    "aqi_normalized": 0.005,
    "age_exposure_interaction": 0.003,
    "log_aqi": 0.002,
}


class SHAPService:
    """
    Lightweight SHAP-inspired explainer.
    Computes per-prediction feature contribution scores
    using feature values × base importance weights.
    Full SHAP computation runs offline during model evaluation.
    """

    def top_factor(self, features: Dict[str, float]) -> str:
        """
        Returns the display name of the top contributing risk factor
        for this specific prediction, based on value-weighted importance.
        """
        scores = {}
        for feature, base_weight in BASE_IMPORTANCE.items():
            value = features.get(feature, 0.0)
            # Normalize value contribution — higher value → higher contribution
            normalized_value = min(abs(value) / (abs(value) + 1.0), 1.0)
            scores[feature] = base_weight * (1.0 + normalized_value)

        top_feature = max(scores, key=scores.get)
        return FEATURE_DISPLAY_NAMES.get(top_feature, top_feature)

    def factor_breakdown(self, features: Dict[str, float]) -> list[dict]:
        """Returns top 5 contributing factors with scores."""
        scores = {}
        for feature, base_weight in BASE_IMPORTANCE.items():
            value = features.get(feature, 0.0)
            normalized_value = min(abs(value) / (abs(value) + 1.0), 1.0)
            scores[feature] = round(base_weight * (1.0 + normalized_value), 4)

        sorted_features = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return [
            {
                "factor": FEATURE_DISPLAY_NAMES.get(f, f),
                "contribution": score,
            }
            for f, score in sorted_features[:5]
        ]
