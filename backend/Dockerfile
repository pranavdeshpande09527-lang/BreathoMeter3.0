# Multi-stage build for FastAPI backend

# ─── Stage 1: Builder ────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies for numpy, onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ─── Stage 2: Production ─────────────────────────────────────
FROM python:3.11-slim AS production

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Non-root user for security
RUN useradd -m -u 1000 breathometer && chown -R breathometer:breathometer /app
USER breathometer

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
