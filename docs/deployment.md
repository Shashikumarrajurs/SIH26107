# NexaStandards — Deployment & Production Runbook

**SIH 2026 Problem Statement**: SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services  
**Environment**: Production / Staging  

---

## 1. System Requirements

- **Python**: 3.10, 3.11, or 3.12
- **Node.js**: >= 18.17.0 (Next.js 14 App Router)
- **Database**: SQLite 3 (included) or PostgreSQL >= 14
- **Operating System**: Linux (Ubuntu 22.04 LTS recommended), macOS, or Windows 11 / Server 2022

---

## 2. Environment Configuration (`.env`)

Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Key environment variables:
```env
# Application Core
PROJECT_NAME="NexaStandards"
SIH_YEAR="2026"
PROBLEM_STATEMENT="SIH26107"
STATUTORY_POLICY="Evidence-Grounded • Source-Locked • Update-Aware"

# Database Configuration
DATABASE_URL="sqlite:///./bis_smartassist.db"

# Validation & Gating Thresholds
CONFIDENCE_THRESHOLD=0.75

# Optional LLM Key (Falls back to deterministic authentic Docling generator if not set)
GEMINI_API_KEY=""

# Polling & Synchronization
SYNC_POLL_INTERVAL_MINUTES=60
```

---

## 3. Quickstart (Development Mode)

### Step 1: Initialize Python Virtual Environment & Install Dependencies
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Seed Authoritative BIS Database
```bash
python database/seed_demo_data.py
```

### Step 3: Launch FastAPI Statutory Backend
```bash
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### Step 4: Launch Next.js Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Platform will be live at: `http://localhost:3000`

---

## 4. Production Build & Execution

### Backend (Uvicorn / Gunicorn with Workers):
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend (Optimized Next.js Standalone Build):
```bash
cd frontend
npm run build
npm run start -p 3000
```

---

## 5. Automated Verification Checklist

Before demonstrating or deploying to production, run:
```bash
# 1. Verify all 35 statutory scenarios
python scripts/run_tests.py

# 2. Verify Sections 50-53 acceptance suite
python scripts/run_acceptance_tests.py

# 3. Verify Next.js production compilation
cd frontend && npm run build
```
All three commands must exit with code 0.
