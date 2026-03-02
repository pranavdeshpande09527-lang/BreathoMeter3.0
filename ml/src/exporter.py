"""
ONNX Exporter — exports calibrated sklearn ensemble to ONNX format.
"""
import logging
import numpy as np
from pathlib import Path

logger = logging.getLogger(__name__)


class ONNXExporter:
    def export(self, model, X_sample: np.ndarray, output_path: str) -> None:
        """
        Attempt ONNX export via skl2onnx.
        Falls back to hummingbird-ml if skl2onnx fails on VotingClassifier.
        """
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Primary: skl2onnx
        try:
            self._export_skl2onnx(model, X_sample, output_path)
            return
        except Exception as e:
            logger.warning(f"skl2onnx export failed: {e}. Trying hummingbird...")

        # Fallback: hummingbird-ml
        try:
            self._export_hummingbird(model, X_sample, output_path)
        except Exception as e:
            logger.error(f"All ONNX export methods failed: {e}")
            raise

    def _export_skl2onnx(self, model, X_sample, output_path: Path) -> None:
        from skl2onnx import convert_sklearn
        from skl2onnx.common.data_types import FloatTensorType

        n_features = X_sample.shape[1] if X_sample.ndim > 1 else 14
        initial_type = [("float_input", FloatTensorType([None, n_features]))]
        onnx_model = convert_sklearn(model, initial_types=initial_type, target_opset=15)

        with open(output_path, "wb") as f:
            f.write(onnx_model.SerializeToString())

        logger.info(f"✅ ONNX exported via skl2onnx: {output_path} ({output_path.stat().st_size / 1024:.1f} KB)")

    def _export_hummingbird(self, model, X_sample, output_path: Path) -> None:
        from hummingbird.ml import convert
        hb_model = convert(model, "onnx", X_sample)
        hb_model.save(str(output_path))
        logger.info(f"✅ ONNX exported via hummingbird: {output_path}")
