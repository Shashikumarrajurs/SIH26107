"""
NexaStandards — 3-Persona Guidance Engine & 12-Step BIS Process Explainer
SIH 2026 Problem Statement: SIH26107

PERSONAS:
1. 🛒 Consumer: 'I bought/want to buy this product. Is it certified? What to check? How to verify?'
2. 🚀 Startup / MSME: 'I want to manufacture/import this product. 14-item practical compliance checklist.'
3. 🏭 Product Builder / Engineer: 'Exact clauses, test matrices, amendments, supersessions, lab capabilities.'

12-STEP BIS PROCESS EXPLAINER:
Converts verified statutory procedures into an understandable, evidence-grounded workflow.
Never invents unverified fees or procedures.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime

# Verified 12-Step BIS Certification Workflow
BIS_12_STEPS = [
    {
        "step_number": 1,
        "title": "Product Scope Identification",
        "plain_explanation": "Define your exact product type, construction, and intended operational use.",
        "why_required": "BIS standards are product-specific; exact material and category determines applicable regulation.",
        "what_you_need": "Product technical specification sheet, bill of materials (BOM), and intended voltage/pressure rating.",
        "next_step": "Standard Identification",
        "official_source": "BIS Conformity Assessment Regulations, 2018"
    },
    {
        "step_number": 2,
        "title": "Indian Standard Identification",
        "plain_explanation": "Identify the official Indian Standard (IS) specification applicable to your product.",
        "why_required": "Sets statutory safety, design, and performance requirements under Indian law.",
        "what_you_need": "Applicable IS Standard code (e.g. IS 17803 for water bottles, IS 2347 for pressure cookers).",
        "next_step": "Mandatory Mandate & QCO Check",
        "official_source": "Bureau of Indian Standards Catalog"
    },
    {
        "step_number": 3,
        "title": "Statutory Mandate & QCO Verification",
        "plain_explanation": "Verify if a Line Ministry Quality Control Order (QCO) makes certification mandatory.",
        "why_required": "Products under mandatory QCO cannot be manufactured, imported, stored, or sold without BIS approval.",
        "what_you_need": "Official Gazette Notification number (e.g. DPIIT S.O. 4582(E) or MeitY CRS Order).",
        "next_step": "Scheme Selection",
        "official_source": "Official Gazette of India"
    },
    {
        "step_number": 4,
        "title": "Certification Scheme Selection",
        "plain_explanation": "Determine whether Scheme I (ISI Mark) or Scheme II (CRS Registration) applies.",
        "why_required": "Scheme I requires factory audit and in-house testing; Scheme II requires lab test reports only.",
        "what_you_need": "Applicable scheme rules under BIS Conformity Assessment Regulations.",
        "next_step": "Pre-Testing & Gap Analysis",
        "official_source": "BIS Act 2016 — Schedule II"
    },
    {
        "step_number": 5,
        "title": "Pre-Testing & In-House Testing Setup",
        "plain_explanation": "Review standard test clauses and establish required internal quality controls.",
        "why_required": "Manufacturers under Scheme I must maintain in-house testing facilities per the STI.",
        "what_you_need": "Scheme of Testing and Inspection (STI) document for the standard.",
        "next_step": "Accredited Laboratory Testing",
        "official_source": "BIS LIMS Division"
    },
    {
        "step_number": 6,
        "title": "NABL / BIS Laboratory Testing",
        "plain_explanation": "Submit product samples to a BIS-recognized or NABL-accredited (ISO/IEC 17025) laboratory.",
        "why_required": "Official test reports confirm product safety parameters before market authorization.",
        "what_you_need": "Complete test samples, test request voucher, and calibrated test parameters.",
        "next_step": "Application Dossier Preparation",
        "official_source": "BIS Recognized Laboratory Network"
    },
    {
        "step_number": 7,
        "title": "Statutory Documentation Preparation",
        "plain_explanation": "Compile required business registration, factory ownership, and technical documents.",
        "why_required": "Incomplete documentation leads to application rejection or processing delays.",
        "what_you_need": "Factory registration / MSME Udyam, equipment list, calibration records, and process flowchart.",
        "next_step": "Portal Application Submission",
        "official_source": "Manakonline / CRS Portal Guidelines"
    },
    {
        "step_number": 8,
        "title": "Online Portal Application",
        "plain_explanation": "Submit application via Manakonline (Scheme I) or BIS CRS portal (Scheme II).",
        "why_required": "Official statutory registration with BIS Central Registry.",
        "what_you_need": "Completed application form, test reports, factory declaration, and statutory fee receipt.",
        "next_step": "Assessment / Factory Inspection",
        "official_source": "https://www.manakonline.in"
    },
    {
        "step_number": 9,
        "title": "BIS Assessment & Factory Audit",
        "plain_explanation": "BIS inspecting officer visits manufacturing premises (Scheme I) or scrutinizes lab reports (Scheme II).",
        "why_required": "Verifies production quality systems, hygiene, and raw material traceability.",
        "what_you_need": "Production demonstration, qualified QC personnel, and test records.",
        "next_step": "Grant of Licence / Registration",
        "official_source": "BIS Audit Guidelines"
    },
    {
        "step_number": 10,
        "title": "Grant of Licence / R-Number",
        "plain_explanation": "BIS issues official licence number (CM/L under Scheme I) or Registration number (R-number under Scheme II).",
        "why_required": "Grants legal authorization to apply the BIS mark and distribute products across India.",
        "what_you_need": "Official BIS grant letter and endorsement certificate.",
        "next_step": "Packaging Marking & Labelling",
        "official_source": "BIS Registry Database"
    },
    {
        "step_number": 11,
        "title": "Product Marking & Packaging",
        "plain_explanation": "Apply the official BIS standard mark, license number, and standard number onto products.",
        "why_required": "Informs consumers of certified conformity; unlabelled products are treated as uncertified.",
        "what_you_need": "Artwork meeting BIS marking guidelines: ISI logo + CM/L or CRS logo + R-number.",
        "next_step": "Continuing Compliance & Surveillance",
        "official_source": "BIS Marking Regulations"
    },
    {
        "step_number": 12,
        "title": "Continuing Compliance & Surveillance",
        "plain_explanation": "Maintain daily testing records, adhere to STI, and participate in market surveillance audits.",
        "why_required": "Ensures batch-to-batch quality; licence renewal depends on clean surveillance records.",
        "what_you_need": "Production logs, annual licence renewal application, and surveillance sample pass reports.",
        "next_step": "Active Market Distribution",
        "official_source": "BIS Post-Certification Surveillance Directorate"
    }
]

class PersonaGuidanceEngine:
    """
    Generates tailored guidance for:
    - Consumer (verification, packaging checks, fake reporting)
    - Startup/MSME (14-item practical manufacturing checklist)
    - Product Builder/Engineer (in-depth clauses, lab parameters, upcoming changes)
    """

    @classmethod
    def build_consumer_view(
        cls,
        product_name: str,
        standard_number: str,
        is_mandatory: bool,
        scheme_name: str,
        qco_order: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generates Consumer Mode response."""
        is_crs = "CRS" in (scheme_name or "")
        is_gold = "1417" in (standard_number or "") or "gold" in product_name.lower()

        if is_gold:
            mark_info = "Look for 3 laser hallmarks: (1) BIS Triangular Logo, (2) Purity Grade (e.g. 22K916), (3) 6-digit alphanumeric HUID code."
            verify_steps = "Open official BIS CARE app → Tap 'Verify HUID' → Enter the 6-digit code to view jeweller name and article type."
        elif is_crs:
            mark_info = "Look for the official CRS Logo accompanied by an 8-digit R-number (e.g. R-41012345) and standard number."
            verify_steps = "Open official BIS CARE app or visit CRS portal → Tap 'Verify R-Number' → Verify brand, model number, and validity."
        else:
            mark_info = "Look for the iconic BIS ISI mark with a 7-digit CM/L licence number (CM/L-XXXXXXX) printed directly beneath the logo."
            verify_steps = "Open official BIS CARE app → Tap 'Verify Licence (CM/L)' → Confirm manufacturer name, factory address, and validity."

        return {
            "persona": "consumer",
            "headline": f"Consumer Safety & Verification Guide: {product_name}",
            "what_is_this_product": f"{product_name} is governed by Indian Standard {standard_number}.",
            "is_bis_mandatory": (
                f"Yes — mandatory statutory requirement under Indian law ({qco_order or 'Government Quality Control Order'})."
                if is_mandatory else
                "Currently governed by voluntary Indian Standards specification."
            ),
            "what_to_look_for_on_packaging": mark_info,
            "how_to_verify": verify_steps,
            "what_does_result_mean": (
                "If verification matches: The product has passed safety audits and is authorized for sale. "
                "If verification fails or number is missing: The product may be uncertified or counterfeit."
            ),
            "what_to_do_if_fake": "Do not use. You can file a statutory consumer grievance under Section 14, 15 & 29 of the BIS Act, 2016 via NexaStandards or the BIS CARE app.",
            "next_action": "Verify the licence/R-number on packaging before making a purchase."
        }

    @classmethod
    def build_startup_view(
        cls,
        product_name: str,
        standard_number: str,
        is_mandatory: bool,
        scheme_name: str,
        qco_order: Optional[str] = None,
        testing_matrix: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Generates Startup / MSME Mode response with a practical 14-item checklist."""
        checklist = [
            {"step": 1, "task": "Identify exact product scope & dimensions", "status": "REQUIRED", "detail": f"Confirm product matches scope of {standard_number}."},
            {"step": 2, "task": "Applicable Indian Standard", "status": "IDENTIFIED", "detail": f"{standard_number}"},
            {"step": 3, "task": "Check statutory mandate status", "status": "MANDATORY" if is_mandatory else "VOLUNTARY", "detail": f"Governing order: {qco_order or 'DPIIT/Ministry Notification'}."},
            {"step": 4, "task": "Check effective date & MSME exemption", "status": "CHECK_DATE", "detail": "Verify if transitional exemption applies for Micro/Small enterprises."},
            {"step": 5, "task": "Identify applicable BIS scheme", "status": "APPLICABLE", "detail": scheme_name},
            {"step": 6, "task": "Review mandatory laboratory tests", "status": "REVIEW_MATRIX", "detail": f"{len(testing_matrix or [])} standard test clauses identified."},
            {"step": 7, "task": "Identify accredited NABL testing lab", "status": "LAB_SELECTION", "detail": "Testing must be at BIS-recognized ISO/IEC 17025 facility."},
            {"step": 8, "task": "Prepare technical documentation", "status": "DOC_PREPARATION", "detail": "MSME Udyam, factory layout, test equipment calibration records, process flow."},
            {"step": 9, "task": "Conduct pre-testing / in-house testing", "status": "TESTING", "detail": "Prepare samples in accordance with standard sample size."},
            {"step": 10, "task": "Submit portal application", "status": "PORTAL_SUBMISSION", "detail": "Apply on Manakonline (Scheme I) or CRS portal (Scheme II)."},
            {"step": 11, "task": "Factory audit & inspection (if Scheme I)", "status": "AUDIT", "detail": "BIS inspecting officer audits quality control setup."},
            {"step": 12, "task": "Grant of licence / R-number", "status": "GRANT", "detail": "Receive formal certificate and unique licence number."},
            {"step": 13, "task": "Follow statutory marking guidelines", "status": "MARKING", "detail": "Print standard mark and licence number on packaging."},
            {"step": 14, "task": "Maintain continuing compliance", "status": "SURVEILLANCE", "detail": "Maintain Scheme of Testing and Inspection (STI) records."}
        ]

        return {
            "persona": "startup",
            "headline": f"Startup & MSME Manufacturing Checklist: {product_name}",
            "product_name": product_name,
            "standard_number": standard_number,
            "scheme_name": scheme_name,
            "is_mandatory": is_mandatory,
            "governing_order": qco_order or "Central Government Notification",
            "checklist": checklist,
            "key_tests_required": [t.get("test_name", "Safety Test") for t in (testing_matrix or [])[:4]],
            "practical_advice": "Start with lab selection and pre-testing before purchasing mass production inventory.",
            "next_action": "Download the Scheme of Testing and Inspection (STI) and engage a recognized testing lab."
        }

    @classmethod
    def build_builder_view(
        cls,
        product_name: str,
        standard_number: str,
        standard_title: str,
        scheme_name: str,
        testing_matrix: List[Dict[str, Any]],
        evidence_citations: List[Dict[str, Any]],
        upcoming_transitions: Optional[List[Dict[str, Any]]] = None,
        superseded_standards: Optional[List[Dict[str, Any]]] = None,
        qco_order: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generates Product Builder / Engineering Mode response."""
        return {
            "persona": "builder",
            "headline": f"Engineering & Regulatory Specification: {standard_number}",
            "standard_number": standard_number,
            "standard_title": standard_title,
            "scheme_name": scheme_name,
            "governing_order": qco_order or "Central Government Order",
            "mandatory_testing_matrix": testing_matrix,
            "evidence_citations": evidence_citations,
            "upcoming_transitions": upcoming_transitions or [],
            "superseded_standards": superseded_standards or [],
            "technical_notes": "All testing must conform to designated tolerances and measurement uncertainties per ISO/IEC 17025.",
            "next_action": "Review laboratory testing matrix clauses and ensure prototype passes thermal and dielectric tolerances."
        }

persona_guidance_engine = PersonaGuidanceEngine()
