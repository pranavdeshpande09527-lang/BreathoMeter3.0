# 🫁 BreathoMeter 3.0

> **AI-Native, Real-Time Respiratory Risk Intelligence Platform**

BreathoMeter is not just an AQI dashboard nor a standalone ML model. It is an **integrated environmental + AI hybrid prediction engine** that fuses live pollution data with calibrated ensemble machine learning to deliver personalized, explainable respiratory disease risk probability.

---

## 🧠 System Identity

> An AI-native, real-time environmental intelligence system that integrates multi-source pollution APIs with calibrated ensemble machine learning to generate personalized, explainable respiratory disease risk probability in a secure, scalable SaaS architecture.

---

## 🏗 Architecture Overview

```
User Request
    ↓
Edge-Optimized Next.js 15 Frontend
    ↓
FastAPI AI Inference Service
    ↓
Parallel AQI Fetch (OpenWeather + WAQI)
    ↓
Data Fusion & Normalization
    ↓
Feature Engineering Layer
    ↓
Calibrated Ensemble ML (ONNX Runtime)
    ↓
Confidence Scoring + SHAP Explainability
    ↓
JSON Response → 3D Visualization + Dashboard
```

---

## 📁 Repository Structure

```
breathometer3/
├── frontend/          # Next.js 15 + React 19 + R3F + D3.js
├── backend/           # FastAPI AI Inference Server
├── ml/                # Ensemble ML training + ONNX export pipeline
├── infrastructure/    # Docker, Nginx, Redis config
└── docs/              # Architecture, API reference, ML pipeline, deployment
```

---

## 🔬 ML Ensemble Architecture

| Model | Weight |
|---|---|
| RandomForest | 35% |
| XGBoost | 35% |
| LogisticRegression | 20% |
| LightGBM | 10% |

- **Calibration**: Isotonic Regression / Platt Scaling
- **Explainability**: SHAP per-prediction
- **Export**: ONNX Runtime (<500ms inference)
- **Monitoring**: MLflow model registry + drift tracking

---

## 🌐 Core API Contract

```http
POST /analyze-air
Content-Type: application/json

{
  "city": "Pune",
  "age": 21,
  "exposure_hours": 4,
  "smoking": 0,
  "pre_existing_condition": 0
}
```

**Response:**
```json
{
  "aqi": 182,
  "pm25": 110,
  "pm10": 160,
  "ml_disease_risk_probability": 0.64,
  "risk_category": "High",
  "confidence_score": 0.87,
  "top_risk_factor": "PM2.5 exposure"
}
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, R3F, Spline, D3.js, Zustand, TanStack Query, Zod |
| Backend | FastAPI, Python 3.11, Pydantic v2, ONNX Runtime, NumPy, SHAP |
| ML | scikit-learn, XGBoost, LightGBM, ONNX, MLflow, Pandas |
| Database | Supabase (PostgreSQL + Auth + Realtime) |
| Cache | Redis |
| Payments | Stripe |
| DevOps | Docker, Docker Compose, Nginx |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+

### 1. Clone & configure environment
```bash
git clone https://github.com/pranavdeshpande09527-lang/BreathoMeter3.0.git
cd BreathoMeter3.0
cp .env.example .env
# Fill in your API keys in .env
```

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

### 3. Access services
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### 4. Local development (without Docker)
```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload

# ML training (provide dataset path first)
cd ml && pip install -r requirements.txt
export DATASET_PATH=/path/to/your/dataset.csv
python src/trainer.py
```

---

## 🔐 Environment Variables

All secrets are managed via environment variables. See `.env.example` for required keys.

**Never commit real API keys, passwords, or secrets.**

Keys required (provided separately):
- `OPENWEATHER_API_KEY` — OpenWeather API
- `WAQI_API_KEY` — World Air Quality Index
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
- `DATASET_PATH` — Local path to training dataset

---

## 🎨 Frontend Features

- **3D Lung Visualization** (React Three Fiber) — risk color transitions: Green → Yellow → Orange → Red
- **Spline Hero** — Immersive interactive landing experience
- **D3.js AQI Gauge** — Precision animated dial
- **SHAP Explainability Card** — Top contributing risk factors
- **Confidence Indicator** — 0–1 confidence bar
- **Supabase Auth** — OAuth 2.0, Magic Link, Email
- **Stripe Checkout** — Subscription-gated premium AI features

---

## 🔒 Security & Compliance

- OAuth 2.0 + JWT rotation
- Role-Based Access Control
- TLS 1.3 in transit, AES-256 at rest
- Row Level Security (Supabase RLS)
- Immutable audit logging
- GDPR-ready structure
- HIPAA-compatible architecture
- FHIR/HL7 data modeling compatibility

---

## 📖 Documentation

| Doc | Description |
|---|---|
| [Architecture](docs/architecture.md) | System design and data flow |
| [API Reference](docs/api-reference.md) | Full endpoint specification |
| [ML Pipeline](docs/ml-pipeline.md) | Training, calibration, ONNX export |
| [Deployment](docs/deployment.md) | Docker, Vercel, Railway instructions |

---

## 📄 License

MIT License — See [LICENSE](LICENSE)

---

*Built with ❤️ — Production-grade from day one.*
