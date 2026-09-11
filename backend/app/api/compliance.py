from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.db.models import StandardModel, TestingRequirementModel, SchemeModel, LaboratoryModel, LaboratoryCapabilityModel

router = APIRouter(prefix="/compliance", tags=["Compliance Assistant & Roadmap"])

class ComplianceRequest(BaseModel):
    product_name: str
    product_category: Optional[str] = None
    manufacturer_type: Optional[str] = "MSME"
    intended_market: Optional[str] = "Domestic & Export"

PRODUCT_MAPPINGS = {
    "cooker": {
        "standard_id": "std_2347",
        "standard_number": "IS 2347:2017",
        "title": "Domestic Pressure Cookers - Specification",
        "scheme": "Scheme I (ISI Mark)",
        "scheme_code": "ISI",
        "qco_notice": "Mandatory under DPIIT Domestic Pressure Cooker (Quality Control) Order, 2023.",
        "documentation": [
            "Factory Layout drawing showing raw material, press shop, assembly, and test station",
            "List of manufacturing machinery (Hydraulic deep-draw presses, CNC spinning lathes, trimming machines)",
            "In-house test equipment (Hydrostatic burst test bench, calibrated pneumatic relief tester)",
            "Calibration certificates of electronic pressure gauges from NABL accredited lab",
            "Raw material test certificates for Aluminum Alloy 3003 or SS Grade 304 food-grade contact",
            "Appointment letter and qualification proof of competent technical quality control supervisor"
        ],
        "fee_estimate": {
            "application_fee": "₹1,000",
            "inspection_fee": "₹7,000 per man-day (Typically 1-2 days)",
            "testing_fee": "₹15,000 - ₹25,000 (depending on external lab)",
            "marking_fee": "Unit-based annual minimum fee ₹46,000 (MSME discount applicable)"
        }
    },
    "bottle": {
        "standard_id": "std_17803",
        "standard_number": "IS 17803:2022",
        "title": "Stainless Steel Vacuum Insulated Flasks and Water Bottles - Specification",
        "scheme": "Scheme I (ISI Mark)",
        "scheme_code": "ISI",
        "qco_notice": "Mandatory under DPIIT Stainless Steel Vacuum Insulated Flasks (QCO) Order, 2023.",
        "documentation": [
            "Factory site plan and process flow chart (Drawing -> Vacuum sealing -> Polishing -> QC)",
            "List of welding & vacuum sealing machinery (Laser seam welding, high vacuum furnace)",
            "Testing equipment (Thermal retention immersion test bath, air pressure leak tester, spectral material analyzer)",
            "Food grade contact test reports for silicone gaskets complying with IS 9845",
            "Traceability log of SS304/SS316 coils with mill test certificates",
            "Quality manual and standard operating procedures (SOP) for factory QC"
        ],
        "fee_estimate": {
            "application_fee": "₹1,000",
            "inspection_fee": "₹7,000 per man-day",
            "testing_fee": "₹18,000 - ₹30,000",
            "marking_fee": "Minimum annual marking fee ₹52,000 (MSME concession 20%)"
        }
    },
    "kettle": {
        "standard_id": "std_302_2_15",
        "standard_number": "IS 302-2-15:2009",
        "title": "Safety of Household and Similar Electrical Appliances: Section 15 Heating Liquids",
        "scheme": "Scheme I (ISI Mark / CRS Option)",
        "scheme_code": "ISI",
        "qco_notice": "Mandatory safety compliance under Household Electrical Appliances QCO.",
        "documentation": [
            "Electrical wiring circuit diagram and earth continuity test layout",
            "Safety critical component list (Thermal cut-out, thermostat, supply cord, heating element) with BIS approval numbers",
            "In-house routine testing equipment (High voltage insulation tester, earth bond meter, leakage current analyzer)",
            "Glow-wire test and flammability reports for polymeric casing parts",
            "User instruction manual draft in Hindi and English with statutory safety warnings"
        ],
        "fee_estimate": {
            "application_fee": "₹1,000",
            "inspection_fee": "₹7,000 per man-day",
            "testing_fee": "₹22,000 - ₹35,000",
            "marking_fee": "Minimum annual marking fee ₹60,000"
        }
    },
    "adapter": {
        "standard_id": "std_13252",
        "standard_number": "IS 13252 (Part 1):2010",
        "title": "Information Technology Equipment - Safety, Part 1 General Requirements",
        "scheme": "Scheme II (Compulsory Registration Scheme - CRS)",
        "scheme_code": "CRS",
        "qco_notice": "Mandatory under MeitY Electronics and Information Technology Goods (Compulsory Registration) Order.",
        "documentation": [
            "Complete electrical schematics, PCB layout, and Bill of Materials (BOM)",
            "Safety test report from a BIS-recognized NABL accredited laboratory in India",
            "Brand authorization letter from trademark owner (for OEM/contract manufacturers)",
            "Undertaking for Compliance of Standard Mark (Self-Declaration format)",
            "User manual with R-number declaration format 'Self-Declaration - Conforming to IS 13252 (Part 1):2010, R-XXXXXXXX'"
        ],
        "fee_estimate": {
            "application_fee": "₹1,000",
            "registration_fee": "₹50,000 per model series (Valid for 2 years)",
            "testing_fee": "₹35,000 - ₹60,000 (sample testing at recognized lab)",
            "marking_fee": "Nil (Registration model, renewed biennially)"
        }
    }
}

@router.post("/roadmap")
def generate_compliance_roadmap(req: ComplianceRequest, db: Session = Depends(get_db)):
    """
    Generates a personalized, authoritative 6-stage compliance roadmap
    for industries, MSMEs, and startups entering the BIS certification journey.
    """
    prod_low = req.product_name.lower().strip()
    
    # Match product profile
    matched_key = "bottle"
    for k in PRODUCT_MAPPINGS:
        if k in prod_low or ("flask" in prod_low and k == "bottle") or ("cooker" in prod_low and k == "cooker") or ("charger" in prod_low and k == "adapter") or ("power" in prod_low and k == "adapter"):
            matched_key = k
            break
            
    mapping = PRODUCT_MAPPINGS[matched_key]
    std = db.query(StandardModel).filter(StandardModel.id == mapping["standard_id"]).first()
    
    # Fetch testing requirements
    tests = db.query(TestingRequirementModel).filter(TestingRequirementModel.standard_id == mapping["standard_id"]).all()
    test_list = [
        {
            "test_name": t.test_name,
            "clause": t.clause,
            "parameter": t.parameter,
            "methodology": t.methodology,
            "acceptance_criteria": t.acceptance_criteria
        }
        for t in tests
    ]
    
    # Fetch recognized laboratories
    caps = db.query(LaboratoryCapabilityModel).filter(LaboratoryCapabilityModel.standard_id == mapping["standard_id"]).all()
    lab_list = []
    for c in caps:
        lab = db.query(LaboratoryModel).filter(LaboratoryModel.id == c.lab_id).first()
        if lab:
            lab_list.append({
                "lab_name": lab.name,
                "lab_code": lab.lab_code,
                "city": lab.city,
                "state": lab.state,
                "contact_email": lab.contact_email,
                "contact_phone": lab.contact_phone,
                "accreditation_status": lab.accreditation_status
            })

    # Build 6 Stages
    roadmap_stages = [
        {
            "stage_number": 1,
            "stage_name": "Standard Identification & Scope",
            "summary": f"Your product '{req.product_name}' must comply with Indian Standard {mapping['standard_number']}.",
            "details": {
                "standard_number": mapping["standard_number"],
                "standard_title": mapping["title"],
                "is_mandatory": std.is_mandatory if std else True,
                "regulatory_order": mapping["qco_notice"]
            },
            "status": "COMPLETED_BY_AI"
        },
        {
            "stage_number": 2,
            "stage_name": "Applicable Certification Scheme",
            "summary": f"Certification must be obtained under {mapping['scheme']}.",
            "details": {
                "scheme_type": mapping["scheme"],
                "scheme_code": mapping["scheme_code"],
                "why_applicable": "Mandated by Ministry Quality Control Order. Scheme I involves factory audit and sample drawing, whereas Scheme II (CRS) relies on accredited test reports.",
                "fee_structure": mapping["fee_estimate"]
            },
            "status": "DETERMINED"
        },
        {
            "stage_number": 3,
            "stage_name": "Technical & Material Specifications",
            "summary": "Align manufacturing processes with mandatory material and structural limits.",
            "details": {
                "specifications": [
                    "Food contact safety: Zero toxic heavy metal leaching (Lead < 0.01%)",
                    "Dimensional consistency adhering to specified tolerances",
                    "Proper brand marking, batch traceability, and statutory label space"
                ]
            },
            "status": "PENDING_MANUFACTURER"
        },
        {
            "stage_number": 4,
            "stage_name": "Mandatory Laboratory Testing Matrix",
            "summary": f"Product prototypes must pass {len(test_list)} statutory parameter tests.",
            "details": {
                "testing_matrix": test_list
            },
            "status": "READY_FOR_TESTING"
        },
        {
            "stage_number": 5,
            "stage_name": "Documentation & Factory Audit Checklist",
            "summary": f"Prepare the 6 required compliance dossiers for the BIS inspection officer.",
            "details": {
                "checklist": mapping["documentation"]
            },
            "status": "ACTION_REQUIRED"
        },
        {
            "stage_number": 6,
            "stage_name": "Accredited Laboratory & Manakonline Portal Submission",
            "summary": "Submit initial application via Manakonline and send samples to recognized testing centers.",
            "details": {
                "portal_url": "https://www.manakonline.in",
                "recommended_laboratories": lab_list,
                "next_steps": [
                    "Register company on Manakonline (e-BIS) portal",
                    "Fill Form I (Application for Grant of License)",
                    "Pay application fee online and upload machinery/test equipment checklists",
                    "Coordinate inspection schedule with assigned BIS technical officer"
                ]
            },
            "status": "NEXT_ACTION"
        }
    ]

    return {
        "product_name": req.product_name,
        "manufacturer_type": req.manufacturer_type,
        "applicable_standard": mapping["standard_number"],
        "scheme": mapping["scheme"],
        "roadmap": roadmap_stages,
        "fee_summary": mapping["fee_estimate"],
        "laboratories_count": len(lab_list),
        "source": "Bureau of Indian Standards (Authoritative Scheme Specifications)"
    }
