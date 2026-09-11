import os
import sys
import time

# Ensure backend root is on sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.db.session import init_db, SessionLocal
from backend.app.middleware import SecurityMiddleware
from database.seed_demo_data import seed

# Routers
from backend.app.api.auth import router as auth_router
from backend.app.api.chat import router as chat_router
from backend.app.api.standards import router as standards_router
from backend.app.api.certification import router as cert_router
from backend.app.api.testing import router as testing_router
from backend.app.api.laboratories import router as lab_router
from backend.app.api.hallmarking import router as hallmark_router
from backend.app.api.consumer import router as consumer_router
from backend.app.api.admin import router as admin_router
from backend.app.api.verify import router as verify_router
from backend.app.api.compliance import router as compliance_router
from backend.app.api.grievance import router as grievance_router
from backend.app.api.gazette import router as gazette_router
from backend.app.api.products import router as products_router
from backend.app.api.updates import router as updates_router
from backend.app.api.sync import router as sync_router
from backend.app.api.evidence import router as evidence_router

app = FastAPI(
    title=f"{settings.PROJECT_NAME} 🛡️",
    version=settings.VERSION,
    description="NexaStandards (SIH26107): AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers. Core Pillars: Ask in One Place, Understand BIS Docs, Verify Products Fast, Take the Next Action.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security + Rate Limiting Middleware
app.add_middleware(SecurityMiddleware)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(standards_router, prefix=settings.API_V1_STR)
app.include_router(cert_router, prefix=settings.API_V1_STR)
app.include_router(testing_router, prefix=settings.API_V1_STR)
app.include_router(lab_router, prefix=settings.API_V1_STR)
app.include_router(hallmark_router, prefix=settings.API_V1_STR)
app.include_router(consumer_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(verify_router, prefix=settings.API_V1_STR)
app.include_router(compliance_router, prefix=settings.API_V1_STR)
app.include_router(grievance_router, prefix=settings.API_V1_STR)
app.include_router(gazette_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(updates_router, prefix=settings.API_V1_STR)
app.include_router(sync_router, prefix=settings.API_V1_STR)
app.include_router(evidence_router, prefix=settings.API_V1_STR)

# Top-level search & convenience endpoints requested by SIH specification
@app.get("/api/search")
def search_alias(q: str):
    from backend.app.api.products import search_products
    from backend.app.db.session import SessionLocal
    db = SessionLocal()
    try:
        return search_products(q=q, db=db)
    finally:
        db.close()

@app.get("/api/product/compliance")
def product_compliance_alias(product: str):
    from backend.app.api.products import search_products
    from backend.app.db.session import SessionLocal
    db = SessionLocal()
    try:
        return search_products(q=product, db=db)
    finally:
        db.close()

@app.get("/api/qco")
def qco_orders_alias(q: str = None, status: str = None):
    from backend.app.api.gazette import get_gazette_orders
    from backend.app.db.session import SessionLocal
    db = SessionLocal()
    try:
        return get_gazette_orders(q=q, status=status, db=db)
    finally:
        db.close()

@app.get("/api/qco/{id}")
def qco_detail_alias(id: str):
    from backend.app.db.session import SessionLocal
    from backend.app.db.models import QCOGazetteModel
    from fastapi import HTTPException
    db = SessionLocal()
    try:
        order = db.query(QCOGazetteModel).filter(
            (QCOGazetteModel.id == id) | (QCOGazetteModel.order_number == id)
        ).first()
        if not order:
            raise HTTPException(status_code=404, detail="QCO Order not found")
        return order
    finally:
        db.close()

@app.get("/api/gazette")
def gazette_alias(q: str = None, status: str = None):
    from backend.app.api.gazette import get_gazette_orders
    from backend.app.db.session import SessionLocal
    db = SessionLocal()
    try:
        return get_gazette_orders(q=q, status=status, db=db)
    finally:
        db.close()


_startup_time = time.time()

@app.on_event("startup")
def on_startup():
    init_db()
    try:
        seed()
    except Exception as e:
        print(f"Seed startup notice: {e}")

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "problem_statement": "SIH26107 - AI-powered Intelligent Assistant for Indian Standards & BIS Services",
        "pillars": [
            "1. Ask in One Place (Text + Voice + Image)",
            "2. Understand BIS Docs (Docling + Gazette + Supersession)",
            "3. Verify Products Fast (OpenCV + PaddleOCR + BIS CARE Registry)",
            "4. Take the Next Action (Compliance Roadmap + Labs + Grievance)"
        ],
        "status": "ONLINE",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }


@app.get("/health")
@app.get("/api/health")
def health_check():
    """Kubernetes / Docker health probe endpoint."""
    try:
        db = SessionLocal()
        db.execute(__import__("sqlalchemy").text("SELECT 1"))
        db.close()
        db_status = "OK"
    except Exception as e:
        db_status = f"ERROR: {e}"

    return {
        "status": "HEALTHY" if db_status == "OK" else "DEGRADED",
        "version": settings.VERSION,
        "database": db_status,
        "uptime_seconds": int(time.time() - _startup_time),
        "project": settings.PROJECT_NAME
    }
