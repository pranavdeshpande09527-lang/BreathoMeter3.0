"""
Feature Engineering Service — must exactly mirror the training pipeline.
All derived features computed identically to what was used during training.
"""
import math
import numpy as np
from typing import Dict


FEATURE_ORDER = [
    "pm25",
    "pm10",
    "aqi",
    "age",
    "exposure_hours",
    "smoking",
    "pre_existing_condition",
    "pollution_exposure_index",
    "pm_ratio",
    "aqi_normalized",
    "age_exposure_interaction",
    "sensitivity_multiplier",
    "log_pm25",
    "log_aqi",
]


class FeatureEngineeringService:
    """
    Builds the full feature vector for ML inference.
    Must EXACTLY mirror src/preprocessor.py in /ml.
    """

    def build_features(
        self,
        pm25: float,
        pm10: float,
        aqi: float,
        age: int,
        exposure_hours: float,
        smoking: int,
        pre_existing_condition: int,
    ) -> Dict[str, float]:
        """Compute all base + derived features."""

        # ─── Derived Features ──────────────────────────────
        # Pollution Exposure Index: weighted sum of pollutants × exposure
        pollution_exposure_index = (pm25 * 0.6 + pm10 * 0.3 + aqi * 0.1) * exposure_hours / 24

        # PM ratio: fine vs coarse particulate matter
        pm_ratio = pm25 / (pm10 + 1e-6)  # avoid division by zero

        # AQI normalized to 0–1 scale (max AQI = 500)
        aqi_normalized = min(aqi / 500.0, 1.0)

        # Age × exposure interaction
        age_exposure_interaction = (age / 100.0) * exposure_hours

        # Sensitivity multiplier (smokers and pre-existing conditions)
        sensitivity_multiplier = 1.0 + (0.5 * smoking) + (0.4 * pre_existing_condition)

        # Log transforms for skewed distributions
        log_pm25 = math.log1p(pm25)
        log_aqi = math.log1p(aqi)

        features = {
            "pm25": float(pm25),
            "pm10": float(pm10),
            "aqi": float(aqi),
            "age": float(age),
            "exposure_hours": float(exposure_hours),
            "smoking": float(smoking),
            "pre_existing_condition": float(pre_existing_condition),
            "pollution_exposure_index": round(pollution_exposure_index, 6),
            "pm_ratio": round(pm_ratio, 6),
            "aqi_normalized": round(aqi_normalized, 6),
            "age_exposure_interaction": round(age_exposure_interaction, 6),
            "sensitivity_multiplier": round(sensitivity_multiplier, 6),
            "log_pm25": round(log_pm25, 6),
            "log_aqi": round(log_aqi, 6),
        }

        return features

    def to_array(self, features: Dict[str, float]) -> np.ndarray:
        """Convert feature dict to ordered numpy array for ONNX input."""
        return np.array([features[k] for k in FEATURE_ORDER], dtype=np.float32).reshape(1, -1)
