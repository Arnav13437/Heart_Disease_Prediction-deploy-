# Heart Disease Risk Predictor

An AI-powered full-stack web application that predicts heart disease risk based on 13 clinical cardiac parameters. Built with a Logistic Regression model trained on the Cleveland Heart Disease dataset.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/heart-disease-predictor)

## Architecture

| Layer      | Technology                        |
|------------|-----------------------------------|
| **Backend**  | Python · FastAPI · Scikit-Learn |
| **Frontend** | React 19 · Vite · Vanilla CSS  |
| **Hosting**  | Vercel (Serverless + Static)    |

## Features

- **ML Inference API** — Pre-trained Logistic Regression model served via FastAPI serverless function
- **Input Validation** — Pydantic field validators with min/max bounds on all 13 parameters
- **Modern UI** — Dark-themed, animated interface with glassmorphism and micro-animations
- **Health Check** — `GET /api/health` endpoint for uptime monitoring

## Quick Start (Local Development)

### 1. Backend

```bash
# Create and activate virtual environment
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Re-train the model
python train_model.py

# Run the API server locally
cd api && uvicorn index:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API calls to `http://localhost:8000`.

## Deploying to Vercel

### Prerequisites
- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free tier works)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/heart-disease-predictor.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect the `vercel.json` configuration
   - Click **Deploy**

3. **Verify**
   - API health: `https://your-app.vercel.app/api/health`
   - Frontend: `https://your-app.vercel.app/`

### Environment Variables (Optional)

| Variable       | Description                          | Default            |
|----------------|--------------------------------------|--------------------|
| `VITE_API_URL` | Override API base URL in frontend    | Auto-detected      |

## Project Structure

```
├── api/
│   └── index.py              # FastAPI serverless function (Vercel)
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── index.html             # HTML entry with SEO meta tags
│   ├── vite.config.js         # Vite build configuration
│   └── package.json           # Frontend dependencies
├── heart_disease_data.csv     # Cleveland Heart Disease dataset
├── model.joblib               # Pre-trained model (committed to repo)
├── train_model.py             # Script to retrain the model
├── heartdisease.py            # Local exploration/dev script
├── requirements.txt           # Python dependencies
├── vercel.json                # Vercel deployment configuration
└── README.md
```

## API Reference

### `GET /api/health`
Returns API status and model load state.

### `POST /api/predict`
Accepts a JSON body with 13 cardiac parameters and returns a prediction.

**Request Body:**
```json
{
  "age": 52, "sex": 1, "cp": 0, "trestbps": 125,
  "chol": 212, "fbs": 0, "restecg": 1, "thalach": 168,
  "exang": 0, "oldpeak": 1.0, "slope": 2, "ca": 2, "thal": 3
}
```

**Response:**
```json
{
  "prediction": 1,
  "confidence": 85,
  "keyFactors": ["Reversible defect", "Major vessels affected"]
}
```

## Disclaimer

⚠️ This is an AI-assisted research and educational project, **not a medical diagnostic tool**. Always consult a qualified cardiologist for medical advice.
