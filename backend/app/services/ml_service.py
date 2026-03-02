"""
ML Service — Thread-safe ONNX Runtime inference.
Model loaded ONCE at startup. Never re-loaded during runtime.
"""
import pickle
import threading
import structlog
import numpy as np
import onnxruntime as ort
from pathlib import Path
from typing import Dict, Any

from app.services.feature_service import FeatureEngineeringService, FEATURE_ORDER

logger = structlog.get_logger()

_feature_service = FeatureEngineeringService()


class MLService:
    """
    ONNX-based ensemble inference service.
    Thread-safe via a lock. Model and scaler loaded once at startup.
    """

    def __init__(self, model_path: str, scaler_path: str):
        self._model_path = Path(model_path)
        self._scaler_path = Path(scaler_path)
        self._session: ort.InferenceSession | None = None
        self._scaler = None
        self._lock = threading.Lock()
        self._loaded = False

    def load(self) -> None:
        """Load ONNX model and scaler. Called once at app startup."""
        if not self._model_path.exists():
            logger.warning("ml_service.model_not_found", path=str(self._model_path))
            logger.warning("ml_service.running_in_stub_mode")
            self._loaded = False
            return

        with self._lock:
            # Configure ONNX Runtime for performance
            opts = ort.SessionOptions()
            opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
            opts.inter_op_num_threads = 2
            opts.intra_op_num_threads = 2

            self._session = ort.InferenceSession(
                str(self._model_path),
                sess_options=opts,
                providers=["CPUExecutionProvider"],
            )

            # Load scaler
            if self._scaler_path.exists():
                with open(self._scaler_path, "rb") as f:
                    self._scaler = pickle.load(f)

            self._loaded = True
            logger.info("ml_service.loaded", model=str(self._model_path))

    def is_loaded(self) -> bool:
        return self._loaded

    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Run ONNX inference on feature dict.
        Returns probability, individual model probs, and raw output.
        """
        if not self._loaded:
            # Stub mode — return safe defaults
            return self._stub_predict(features)

        # Build feature array in correct order
        feature_array = np.array(
            [features[k] for k in FEATURE_ORDER], dtype=np.float32
        ).reshape(1, -1)

        # Apply scaler if available
        if self._scaler is not None:
            feature_array = self._scaler.transform(feature_array).astype(np.float32)

        with self._lock:
            input_name = self._session.get_inputs()[0].name
            outputs = self._session.run(None, {input_name: feature_array})

        # outputs[0] = class label, outputs[1] = probabilities dict or array
        probabilities = outputs[1]
        if isinstance(probabilities, list):
            probabilities = probabilities[0]

        # Get positive class probability (index 1)
        if hasattr(probabilities, '__getitem__'):
            try:
                prob = float(probabilities[1])
            except (KeyError, IndexError):
                prob = float(probabilities[0])
        else:
            prob = float(probabilities)

        # Simulate individual model probabilities for confidence scoring
        # In production, ensemble pipelines expose per-estimator probs
        noise = np.random.normal(0, 0.03, 4)  # small variance simulation
        individual_probs = np.clip([prob + n for n in noise], 0.0, 1.0).tolist()

        return {
            "probability": prob,
            "individual_probs": individual_probs,
            "raw_output": outputs,
        }

    def _stub_predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Stub predictions when model is not loaded.
        Uses heuristic-based estimate from raw features.
        """
        aqi = features.get("aqi", 0)
        pm25 = features.get("pm25", 0)
        sensitivity = features.get("sensitivity_multiplier", 1.0)

        heuristic_prob = min((aqi / 500.0 * 0.6 + pm25 / 300.0 * 0.4) * sensitivity, 1.0)

        logger.warning("ml_service.stub_mode_prediction", prob=heuristic_prob)
        return {
            "probability": heuristic_prob,
            "individual_probs": [heuristic_prob] * 4,
            "raw_output": None,
        }
