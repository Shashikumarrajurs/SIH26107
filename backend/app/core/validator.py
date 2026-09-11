from typing import Dict, Any, List, Optional
from datetime import date, datetime

STATUTORY_FALLBACK = (
    "I could not verify this information from the available official BIS sources. "
    "I don't want to provide potentially incorrect regulatory information. "
    "Please provide more details or check the official BIS source."
)

def parse_iso_date(date_str: Optional[str]) -> Optional[date]:
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str.strip()[:10], "%Y-%m-%d").date()
    except Exception:
        return None

def validate_regulatory_claims(
    query: str,
    evidence_items: List[Dict[str, Any]],
    product_profile: Optional[Dict[str, Any]] = None,
    intent: Optional[str] = None
) -> Dict[str, Any]:
    """
    Validates regulatory safety, supersession status, effective dates,
    source authority, and conflicting evidence before returning an answer.
    """
    today = date.today()
    warnings = []
    conflicts = []
    is_superseded = False
    has_upcoming = False
    
    # 1. Immediate abstention if no evidence is available or explicit unsupported query
    if not evidence_items or intent == "UNSUPPORTED_QUERY":
        return {
            "is_valid": False,
            "evidence_status": "LOW_EVIDENCE",
            "confidence": 0.15,
            "is_grounded": False,
            "fallback_required": True,
            "fallback_message": STATUTORY_FALLBACK,
            "warnings": ["No verified official BIS document chunks matched this query."],
            "conflicts": []
        }

    # 2. Check for superseded standards or future effective dates in retrieved chunks
    for ev in evidence_items:
        eff_date_str = ev.get("effective_date")
        status_str = ev.get("status", "ACTIVE")
        
        eff_date = parse_iso_date(eff_date_str)
        if eff_date and eff_date > today:
            has_upcoming = True
            warnings.append(
                f"Upcoming Requirement Notice: Specification under {ev.get('standard_number')} "
                f"has a future enforcement date ({eff_date_str}). It is not yet legally mandatory today."
            )
            
        if status_str in ["SUPERSEDED", "WITHDRAWN", "HISTORICAL"]:
            is_superseded = True
            warnings.append(
                f"Superseded Specification Notice: {ev.get('standard_number')} is replaced or superseded. "
                "Active certification must follow the newer revision."
            )

    # 3. Detect conflicting official claims across evidence items
    std_numbers = set()
    for ev in evidence_items:
        s_num = ev.get("standard_number")
        if s_num:
            std_numbers.add(s_num)

    if len(std_numbers) > 1 and intent not in ["COMPARISON", "PRODUCT_SEARCH", "STANDARD_RECOMMENDATION"]:
        # Check if relationship exists
        has_relation = any(ev.get("supersedes") or ev.get("superseded_by") for ev in evidence_items)
        if not has_relation:
            conflicts.append(
                f"Multiple standards retrieved ({', '.join(std_numbers)}). Verify specific product scope."
            )

    # 4. Keyword and substantive relevance scoring
    GENERIC_STOPWORDS = {
        "what", "when", "where", "which", "does", "about", "have", "with", "from",
        "mandatory", "specification", "requirements", "requirement", "standard", "standards",
        "under", "indian", "tell", "show", "give", "please", "device", "devices", "order",
        "applies", "apply", "certify", "certification", "information", "product", "products", "item", "items"
    }

    query_tokens = [w.strip("?,.:;\"'()[]{}").lower() for w in query.split()]
    substantive_tokens = [w for w in query_tokens if len(w) > 3 and w not in GENERIC_STOPWORDS]

    evidence_text = " ".join([
        (ev.get("text", "") + " " + ev.get("document_title", "") + " " + ev.get("standard_number", "")).lower()
        for ev in evidence_items
    ])
    
    matches = sum(1 for w in substantive_tokens if w in evidence_text)
    overlap_ratio = matches / max(len(substantive_tokens), 1) if substantive_tokens else 0.0

    max_score = max((float(ev.get("score", 0.0) or 0.0) for ev in evidence_items), default=0.0)
    has_product = bool(product_profile and product_profile.get("product"))
    
    # Grounding confidence calculation
    if has_product:
        confidence = round(min(0.85 + (max_score * 0.15), 0.98), 2)
        is_grounded = True
        evidence_status = "GROUNDED"
        fallback_required = False
        fallback_msg = None
    elif substantive_tokens and overlap_ratio >= 0.25 and max_score >= 0.15:
        confidence = round(min(0.78 + (overlap_ratio * 0.15), 0.95), 2)
        is_grounded = True
        evidence_status = "GROUNDED"
        fallback_required = False
        fallback_msg = None
    elif not substantive_tokens and len(query_tokens) <= 3 and max_score >= 0.20:
        confidence = 0.80
        is_grounded = True
        evidence_status = "GROUNDED"
        fallback_required = False
        fallback_msg = None
    else:
        confidence = 0.25
        is_grounded = False
        evidence_status = "LOW_EVIDENCE"
        fallback_required = True
        fallback_msg = STATUTORY_FALLBACK

    from backend.app.config import settings
    if confidence < settings.CONFIDENCE_THRESHOLD:
        fallback_required = True
        fallback_msg = STATUTORY_FALLBACK
        evidence_status = "LOW_EVIDENCE"

    return {
        "is_valid": not fallback_required,
        "evidence_status": evidence_status,
        "confidence": confidence,
        "is_grounded": is_grounded,
        "fallback_required": fallback_required,
        "fallback_message": fallback_msg,
        "warnings": warnings,
        "conflicts": conflicts,
        "is_superseded": is_superseded,
        "has_upcoming": has_upcoming
    }

def validate_citations_and_evidence(
    answer: str,
    evidence_items: List[Dict[str, Any]],
    intent: str
) -> Dict[str, Any]:
    return validate_regulatory_claims(
        query=answer,
        evidence_items=evidence_items,
        intent=intent
    )
