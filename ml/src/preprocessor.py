"""
Feature Preprocessor — ML Training Pipeline
Must exactly match backend/app/services/feature_service.py.
"""
import math
import logging
import numpy as np
import pandas as pd
from typing import Tuple

logger = logging.getLogger(__name__)

# Must stay in sync with backend feature_service.py FEATURE_ORDER
FEATURE_ORDER = [
    "pm25", "pm10", "aqi", "age", "exposure_hours",
    "smoking", "pre_existing_condition",
    "pollution_exposure_index", "pm_ratio", "aqi_normalized",
    "age_exposure_interaction", "sensitivity_multiplier",
    "log_pm25", "log_aqi",
]


class FeaturePreprocessor:
    def __init__(self, config: dict):
        self.config = config
        self.target_col = config["data"]["target_column"]
        self.base_features = config["data"]["base_features"]

    def fit_transform(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        df = df.copy()
        df = self._validate(df)
        df = self._engineer(df)
        df = self._handle_missing(df)

        X = df[FEATURE_ORDER].values.astype(np.float32)
        y = df[self.target_col].values.astype(np.int32)

        logger.info(f"Features shape: {X.shape}, Positive class rate: {y.mean():.3f}")
        return X, y

    def transform_single(self, row: dict) -> np.ndarray:
        df = pd.DataFrame([row])
        df = self._engineer(df)
        return df[FEATURE_ORDER].values.astype(np.float32)

    def _validate(self, df: pd.DataFrame) -> pd.DataFrame:
        missing = [c for c in self.base_features + [self.target_col] if c not in df.columns]
        if missing:
            raise ValueError(f"Missing columns in dataset: {missing}")
        before = len(df)
        df = df.dropna(subset=self.base_features + [self.target_col])
        logger.info(f"Dropped {before - len(df)} rows with nulls. Remaining: {len(df)}")
        return df

    def _engineer(self, df: pd.DataFrame) -> pd.DataFrame:
        """Derived features — must match backend feature_service.py exactly."""
        df["pollution_exposure_index"] = (
            df["pm25"] * 0.6 + df["pm10"] * 0.3 + df["aqi"] * 0.1
        ) * df["exposure_hours"] / 24

        df["pm_ratio"] = df["pm25"] / (df["pm10"] + 1e-6)
        df["aqi_normalized"] = (df["aqi"] / 500.0).clip(0, 1)
        df["age_exposure_interaction"] = (df["age"] / 100.0) * df["exposure_hours"]
        df["sensitivity_multiplier"] = 1.0 + (0.5 * df["smoking"]) + (0.4 * df["pre_existing_condition"])
        df["log_pm25"] = np.log1p(df["pm25"])
        df["log_aqi"] = np.log1p(df["aqi"])
        return df

    def _handle_missing(self, df: pd.DataFrame) -> pd.DataFrame:
        df[FEATURE_ORDER] = df[FEATURE_ORDER].fillna(df[FEATURE_ORDER].median())
        return df
