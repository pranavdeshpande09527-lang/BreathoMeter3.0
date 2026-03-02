"""
Model Evaluator — computes calibration, classification, and ranking metrics.
"""
import logging
import numpy as np
from sklearn.metrics import (
    roc_auc_score, f1_score, precision_score, recall_score,
    accuracy_score, log_loss, brier_score_loss,
)

logger = logging.getLogger(__name__)


class ModelEvaluator:
    def evaluate(self, model, X_val: np.ndarray, y_val: np.ndarray) -> dict:
        y_pred = model.predict(X_val)
        y_proba = model.predict_proba(X_val)[:, 1]

        metrics = {
            "accuracy": round(float(accuracy_score(y_val, y_pred)), 4),
            "f1": round(float(f1_score(y_val, y_pred)), 4),
            "precision": round(float(precision_score(y_val, y_pred)), 4),
            "recall": round(float(recall_score(y_val, y_pred)), 4),
            "roc_auc": round(float(roc_auc_score(y_val, y_proba)), 4),
            "log_loss": round(float(log_loss(y_val, y_proba)), 4),
            "brier_score": round(float(brier_score_loss(y_val, y_proba)), 4),
        }

        logger.info("=" * 50)
        logger.info("EVALUATION RESULTS")
        logger.info("=" * 50)
        for k, v in metrics.items():
            logger.info(f"  {k:<20}: {v}")
        logger.info("=" * 50)

        return metrics
