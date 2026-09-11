import uuid
import json
import random
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.db.models import ConsumerGrievanceModel

router = APIRouter(prefix="/grievance", tags=["BIS Consumer Grievance Assistance"])

class GrievanceRequest(BaseModel):
    product_name: str
    alleged_license_number: Optional[str] = None
    seller_name: str
    seller_address: Optional[str] = None
    purchase_platform: Optional[str] = "Retail Shop"
    invoice_number: Optional[str] = None
    complaint_type: str = "FAKE_ISI_MARK"
    description: str
    complainant_name: Optional[str] = "Concerned Consumer"
    complainant_email: Optional[str] = None
    complainant_phone: Optional[str] = None

@router.post("/create")
def create_consumer_grievance(req: GrievanceRequest, db: Session = Depends(get_db)):
    """
    Creates a statutory consumer grievance complaint dossier under the BIS Act, 2016.
    Provides legal framing, statutory penalty citations, and direct BIS CARE submission instructions.
    """
    ref_suffix = f"{random.randint(1000, 9999)}"
    ref_no = f"BIS-GRV-2026-{ref_suffix}"
    
    # Statutory legal framing based on complaint type
    statutory_citations = [
        "The Bureau of Indian Standards Act, 2016 (Act No. 11 of 2016)",
        "Section 14: Prohibition on use of Standard Mark without valid license",
        "Section 15: Prohibition of manufacture, storage, sale of goods without mandatory mark",
        "Section 29: Penalties for contravention (Imprisonment up to 2 years and fine up to ₹5,00,000 or ten times the value of goods)"
    ]
    
    formatted_dossier = f"""================================================================================
STATUTORY CONSUMER COMPLAINT DOSSIER (BUREAU OF INDIAN STANDARDS)
Reference Tracking No: {ref_no}
Filing Date: September 11, 2026
================================================================================

TO:
The Central Consumer Affairs & Enforcement Department
Bureau of Indian Standards (BIS)
Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002
Official Portal: https://www.services.bis.gov.in / BIS CARE App

SUBJECT:
Formal Grievance Regarding Suspected Counterfeit / Unauthorized Use of BIS Standard Mark on '{req.product_name}'

1. COMPLAINANT PARTICULARS:
   - Full Name: {req.complainant_name or 'Aggrieved Citizen / Consumer'}
   - Contact Email: {req.complainant_email or 'consumer-protect@bis.gov.in'}
   - Contact Mobile: {req.complainant_phone or 'Not Disclosed'}

2. PRODUCT & SUSPECTED VIOLATION:
   - Product Name: {req.product_name}
   - Alleged CM/L or R-Number: {req.alleged_license_number or 'Unspecified / No Number Found'}
   - Nature of Violation: {req.complaint_type}
   - Detailed Narrative: {req.description}

3. RETAILER / SELLER PARTICULARS:
   - Vendor / Shop Name: {req.seller_name}
   - Vendor Location / Address: {req.seller_address or 'Provided in Attached Evidence'}
   - Purchase Mode / Platform: {req.purchase_platform}
   - Invoice / Cash Memo No: {req.invoice_number or 'Available Upon Request'}

4. STATUTORY BASIS & LEGAL CLAIMS:
   The complainant respectfully submits that the commercialization of this product without
   a valid, active BIS license or with an unauthorized/counterfeit ISI mark constitutes
   a cognizable statutory violation under:
   - BIS Act 2016, Section 14 (Unauthorized Use of Standard Mark)
   - BIS Act 2016, Section 15 (Failure to Conform with Notified Quality Control Orders)
   - BIS Act 2016, Section 29 (Criminal Penalties for Counterfeiting)

5. PRAYER / REQUESTED REMEDY:
   a) Conduct an urgent market surveillance seizure and inspection at the seller premises.
   b) Verify the authenticity of alleged license '{req.alleged_license_number}'.
   c) Prosecute non-compliant manufacturers/distributors under Section 29 of the BIS Act.
   d) Protect public safety and consumer welfare against hazardous sub-standard goods.

================================================================================
VERIFICATION & AFFIRMATION:
The information provided herein is accurate to the best of my knowledge and belief.
================================================================================
"""

    grievance = ConsumerGrievanceModel(
        id=str(uuid.uuid4()),
        complaint_ref_no=ref_no,
        complainant_name=req.complainant_name,
        complainant_email=req.complainant_email,
        complainant_phone=req.complainant_phone,
        product_name=req.product_name,
        alleged_license_number=req.alleged_license_number,
        seller_name=req.seller_name,
        seller_address=req.seller_address,
        purchase_platform=req.purchase_platform,
        invoice_number=req.invoice_number,
        complaint_type=req.complaint_type,
        description=req.description,
        statutory_violation="BIS Act 2016 Section 14, 15 & 29",
        status="DOSSIER_READY",
        dossier_json=json.dumps({"formatted_text": formatted_dossier})
    )
    db.add(grievance)
    db.commit()

    return {
        "complaint_ref_no": ref_no,
        "product_name": req.product_name,
        "seller_name": req.seller_name,
        "status": "DOSSIER_READY",
        "statutory_citations": statutory_citations,
        "formatted_dossier": formatted_dossier,
        "submission_channels": [
            {
                "channel": "BIS CARE Mobile App",
                "method": "Open app -> Complaints section -> Enter seller details -> Attach photo of product mark & invoice.",
                "url": "https://play.google.com/store/apps/details?id=com.bis.mobile"
            },
            {
                "channel": "BIS Grievance Portal",
                "method": "Log in to https://www.services.bis.gov.in and paste this generated statutory dossier.",
                "url": "https://www.services.bis.gov.in"
            },
            {
                "channel": "Official BIS Consumer Helpline",
                "method": "Toll-free: 1800-11-0001 | Email: consumer@bis.gov.in",
                "url": "mailto:consumer@bis.gov.in"
            }
        ]
    }
