from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.db.session import get_db

router = APIRouter(prefix="/certification", tags=["BIS Certification"])

class AnalyzeRequest(BaseModel):
    product: str
    standard_number: Optional[str] = None
    location: Optional[str] = "India"

@router.get("/guide")
def get_certification_guide():
    return {
        "schemes": [
            {
                "code": "ISI",
                "name": "Scheme I - Product Certification Scheme",
                "description": "Standard Mark (ISI) license for domestic and foreign manufacturers.",
                "applicability": "Mandatory for 500+ products (steel, electronics, appliances, cement, water bottles)."
            },
            {
                "code": "CRS",
                "name": "Scheme II - Compulsory Registration Scheme",
                "description": "Registration scheme for IT & Electronics goods based on self-declaration of conformity.",
                "applicability": "Mandatory for 60+ electronics product categories."
            },
            {
                "code": "HALLMARK",
                "name": "BIS Hallmarking Scheme",
                "description": "Purity certification for gold and silver jewellery.",
                "applicability": "Mandatory for gold jewelers in notified districts."
            }
        ]
    }

@router.post("/analyze")
def analyze_certification(req: AnalyzeRequest, db: Session = Depends(get_db)):
    return {
        "product": req.product,
        "is_mandatory": True,
        "recommended_scheme": "Scheme I (ISI Mark)",
        "application_portal": "https://www.manakonline.in",
        "estimated_timeline": "30 to 45 Days",
        "required_documents": [
            "Factory Registration / Trade License",
            "Manufacturing Process Flowchart & Machinery Details",
            "In-house Testing Laboratory Equipment Calibration",
            "NABL Third-Party Lab Test Report",
            "Authorized Signatory ID Proof"
        ],
        "fee_breakdown": {
            "application_fee": "₹1,000",
            "inspection_fee": "₹7,000 per man-day",
            "marking_fee": "As per product specific scale"
        }
    }
