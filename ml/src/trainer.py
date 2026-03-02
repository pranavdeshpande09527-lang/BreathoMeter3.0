"""
Ensemble Trainer — BreathoMeter3.0 ML Pipeline
Soft-voting ensemble: RF(0.35) + XGBoost(0.35) + LR(0.20) + LightGBM(0.10)
Calibrated with Isotonic Regression.
Trains offline only. Never runs inside the API.
"""
import os
import yaml
import pickle
import logging
import numpy as np
import pandas as pd
import mlflow
import mlflow.sklearn
from pathlib import Path
from typing import Optional

from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import roc_auc_score, f1_score, classification_report
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

from src.preprocessor import FeaturePreprocessor
from src.evaluator import ModelEvaluator
from src.exporter import ONNXExporter

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


class EnsembleTrainer:
    """
    Orchestrates the full training pipeline:
    Load → Preprocess → Train ensemble → Calibrate → Evaluate → Export to ONNX
    """

    def __init__(self, config_path: str = "configs/model_config.yaml"):
        with open(config_path) as f:
            self.config = yaml.safe_load(f)

        self.output_dir = Path(self.config["paths"]["model_output_dir"])
        self.output_dir.mkdir(parents=True, exist_ok=True)

        mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000"))
        mlflow.set_experiment(os.getenv("MLFLOW_EXPERIMENT_NAME", "breathometer_ensemble"))

    def load_data(self, dataset_path: Optional[str] = None) -> pd.DataFrame:
        path = dataset_path or os.getenv("DATASET_PATH")
        if not path:
            raise ValueError("DATASET_PATH env var or dataset_path argument required.")
        path = Path(path)
        if not path.exists():
            raise FileNotFoundError(f"Dataset not found: {path}")

        ext = path.suffix.lower()
        if ext == ".csv":
            df = pd.read_csv(path)
        elif ext in (".xlsx", ".xls"):
            df = pd.read_excel(path)
        elif ext == ".parquet":
            df = pd.read_parquet(path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

        logger.info(f"Loaded dataset: {path} — {len(df):,} rows × {len(df.columns)} cols")
        return df

    def _build_ensemble(self) -> VotingClassifier:
        """Build the soft-voting ensemble with configured weights."""
        ec = self.config["ensemble"]
        est = [
            ("rf", RandomForestClassifier(
                n_estimators=ec["random_forest"]["n_estimators"],
                max_depth=ec["random_forest"]["max_depth"],
                min_samples_leaf=ec["random_forest"]["min_samples_leaf"],
                random_state=42, n_jobs=-1,
            )),
            ("xgb", XGBClassifier(
                n_estimators=ec["xgboost"]["n_estimators"],
                max_depth=ec["xgboost"]["max_depth"],
                learning_rate=ec["xgboost"]["learning_rate"],
                subsample=ec["xgboost"]["subsample"],
                use_label_encoder=False,
                eval_metric="logloss",
                random_state=42, n_jobs=-1,
            )),
            ("lr", LogisticRegression(
                C=ec["logistic_regression"]["C"],
                max_iter=ec["logistic_regression"]["max_iter"],
                random_state=42,
            )),
            ("lgbm", LGBMClassifier(
                n_estimators=ec["lightgbm"]["n_estimators"],
                max_depth=ec["lightgbm"]["max_depth"],
                learning_rate=ec["lightgbm"]["learning_rate"],
                random_state=42, n_jobs=-1, verbose=-1,
            )),
        ]
        weights = [
            ec["weights"]["rf"],
            ec["weights"]["xgb"],
            ec["weights"]["lr"],
            ec["weights"]["lgbm"],
        ]
        return VotingClassifier(estimators=est, voting="soft", weights=weights, n_jobs=-1)

    def train(self, dataset_path: Optional[str] = None) -> dict:
        """Full training pipeline. Returns evaluation metrics."""

        with mlflow.start_run(run_name="ensemble_training"):
            # ─── Load ─────────────────────────────────────
            df = self.load_data(dataset_path)
            mlflow.log_param("dataset_rows", len(df))

            # ─── Preprocess ───────────────────────────────
            preprocessor = FeaturePreprocessor(self.config)
            X, y = preprocessor.fit_transform(df)
            mlflow.log_param("feature_count", X.shape[1])
            mlflow.log_param("positive_rate", float(y.mean()))

            # ─── Scaler ───────────────────────────────────
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)

            # ─── Train / Val split ────────────────────────
            X_train, X_val, y_train, y_val = train_test_split(
                X_scaled, y,
                test_size=self.config["training"]["val_size"],
                random_state=42,
                stratify=y,
            )

            # ─── Build ensemble ───────────────────────────
            ensemble = self._build_ensemble()
            logger.info("Training ensemble (RF + XGBoost + LR + LightGBM)…")
            ensemble.fit(X_train, y_train)

            # ─── Calibrate ────────────────────────────────
            logger.info("Calibrating with Isotonic Regression…")
            calibrated = CalibratedClassifierCV(
                ensemble, method=self.config["calibration"]["method"],
                cv=self.config["calibration"]["cv_folds"],
            )
            calibrated.fit(X_train, y_train)

            # ─── Evaluate ─────────────────────────────────
            evaluator = ModelEvaluator()
            metrics = evaluator.evaluate(calibrated, X_val, y_val)
            mlflow.log_metrics(metrics)
            logger.info(f"Metrics: {metrics}")

            # ─── Cross-validation ─────────────────────────
            cv_scores = cross_val_score(calibrated, X_scaled, y, cv=StratifiedKFold(5), scoring="roc_auc")
            mlflow.log_metric("cv_roc_auc_mean", float(cv_scores.mean()))
            mlflow.log_metric("cv_roc_auc_std", float(cv_scores.std()))
            logger.info(f"CV ROC-AUC: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

            # ─── Save scaler ──────────────────────────────
            scaler_path = self.output_dir / self.config["paths"]["scaler_filename"]
            with open(scaler_path, "wb") as f:
                pickle.dump(scaler, f)
            logger.info(f"Scaler saved: {scaler_path}")

            # ─── Export ONNX ──────────────────────────────
            onnx_path = self.output_dir / self.config["paths"]["onnx_filename"]
            exporter = ONNXExporter()
            exporter.export(calibrated, X_train, str(onnx_path))
            mlflow.log_artifact(str(onnx_path))
            logger.info(f"ONNX model exported: {onnx_path}")

            # ─── Save sklearn pkl (backup) ─────────────────
            pkl_path = self.output_dir / "ensemble_calibrated.pkl"
            with open(pkl_path, "wb") as f:
                pickle.dump(calibrated, f)
            mlflow.log_artifact(str(pkl_path))

            return metrics


if __name__ == "__main__":
    import sys
    dataset = sys.argv[1] if len(sys.argv) > 1 else None
    trainer = EnsembleTrainer()
    metrics = trainer.train(dataset)
    print("\n✅ Training complete.")
    print(f"   ROC-AUC : {metrics.get('roc_auc', 'N/A'):.4f}")
    print(f"   F1      : {metrics.get('f1', 'N/A'):.4f}")
