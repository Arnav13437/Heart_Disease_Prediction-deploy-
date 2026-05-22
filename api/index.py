"""
Heart Disease Prediction API — Production Endpoint
Deployed as a Vercel Serverless Function.
"""

import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Heart Disease Prediction API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Model Loading ────────────────────────────────────────────────────────────
# Resolve model path relative to this file (handles Vercel's directory layout)
_this_dir = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.dirname(_this_dir)
_model_candidates = [
    os.path.join(_project_root, "model.joblib"),
    os.path.join(_this_dir, "model.joblib"),
    "model.joblib",
]

model = None
for _path in _model_candidates:
    if os.path.exists(_path):
        model = joblib.load(_path)
        break

if model is None:
    print("WARNING: model.joblib not found in any expected location!")


# ─── Request / Response Schemas ───────────────────────────────────────────────
class PatientData(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Patient age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex (1 = Male, 0 = Female)")
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0-3)")
    trestbps: int = Field(..., ge=50, le=250, description="Resting blood pressure (mm Hg)")
    chol: int = Field(..., ge=50, le=600, description="Serum cholesterol (mg/dl)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (1=yes, 0=no)")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0-2)")
    thalach: int = Field(..., ge=50, le=250, description="Max heart rate achieved (bpm)")
    exang: int = Field(..., ge=0, le=1, description="Exercise induced angina (1=yes, 0=no)")
    oldpeak: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise")
    slope: int = Field(..., ge=0, le=2, description="Slope of peak exercise ST segment (0-2)")
    ca: int = Field(..., ge=0, le=3, description="Major vessels colored by fluoroscopy (0-3)")
    thal: int = Field(..., ge=1, le=3, description="Thalassemia type (1-3)")


class PredictionResponse(BaseModel):
    prediction: int
    confidence: int
    keyFactors: list[str]


# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }


@app.get("/api/predict")
def predict_get():
    """Friendly message for GET requests to the predict endpoint."""
    return {"message": "Use POST method with patient data to get a prediction."}


@app.post("/api/predict", response_model=PredictionResponse)
def predict(data: PatientData):
    """Run heart disease prediction on patient data."""
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Ensure model.joblib is deployed.",
        )

    input_data = (
        data.age, data.sex, data.cp, data.trestbps, data.chol,
        data.fbs, data.restecg, data.thalach, data.exang,
        data.oldpeak, data.slope, data.ca, data.thal,
    )
    input_array = np.asarray(input_data, dtype=np.float64).reshape(1, -1)

    try:
        prediction = model.predict(input_array)[0]
        probs = model.predict_proba(input_array)[0]
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {exc}",
        )

    confidence = int(max(probs) * 100)

    # Determine key contributing factors
    factors: list[str] = []
    if data.thal == 3:
        factors.append("Reversible defect")
    if data.cp >= 1:
        factors.append("Chest pain present")
    if data.ca > 0:
        factors.append("Major vessels affected")
    if data.exang == 1:
        factors.append("Exercise-induced angina")
    if data.oldpeak > 2.0:
        factors.append("High ST depression")
    if not factors:
        factors.append("Based on overall profile")

    return {
        "prediction": int(prediction),
        "confidence": confidence,
        "keyFactors": factors[:3],
    }
