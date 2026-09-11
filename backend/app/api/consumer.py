from typing import Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/consumer", tags=["Consumer Portal & ISI Verification"])

class ConsumerQueryRequest(BaseModel):
    query: str
    license_number: Optional[str] = None

@router.post("/query")
def process_consumer_query(req: ConsumerQueryRequest):
    return {
        "query": req.query,
        "verification_tool": "BIS Care Mobile App / Manakonline Portal",
        "how_to_verify_isi_mark": [
            "Check for the standard ISI mark logo on the product packaging.",
            "Verify the CML (Certificate of Manufacturer License) 7-digit number printed below the logo.",
            "Enter the CML number in BIS Care App 'Verify License' option to verify manufacturer name, address, valid scope, and expiration date."
        ],
        "how_to_verify_huid": [
            "Locate 6-digit alphanumeric code laser-etched on gold jewellery.",
            "Open BIS Care App -> 'Verify HUID' feature.",
            "View registered jeweller details, AHC center name, hallmarking date, and purity grade."
        ],
        "complaint_redressal": "Consumers can lodge statutory quality complaints directly via BIS Care App or email consumer@bis.gov.in."
    }
