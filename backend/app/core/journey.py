from typing import Dict, Any, List

def build_bis_journey(
    product_profile: Dict[str, Any],
    recommended_standards: List[Dict[str, Any]],
    certification_guidance: Dict[str, Any],
    testing_information: List[Dict[str, Any]],
    laboratories: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Builds a dynamic 6-stage BIS journey tailored to the specific product and standards.
    """
    product_name = product_profile.get("product") or "Specified Product"
    material = product_profile.get("material") or ""
    
    journey_steps = [
        {
            "step_number": 1,
            "title": "Product Identification & Material Definition",
            "status": "COMPLETED" if product_profile.get("product") else "IN_PROGRESS",
            "summary": f"Product: {product_name} {f'({material})' if material else ''}",
            "details": f"Market: {product_profile.get('market', 'India')} | Industry: {product_profile.get('industry', 'Consumer Goods')}"
        },
        {
            "step_number": 2,
            "title": "Indian Standard Identification",
            "status": "COMPLETED" if recommended_standards else "ACTION_REQUIRED",
            "summary": f"Primary Standard: {recommended_standards[0]['standard_number']}" if recommended_standards else "No standard matched yet",
            "details": f"Title: {recommended_standards[0]['title']}" if recommended_standards else "Describe product specifications for standard recommendation."
        },
        {
            "step_number": 3,
            "title": "Conformity Scheme Selection",
            "status": "IN_PROGRESS" if recommended_standards else "PENDING",
            "summary": certification_guidance.get("scheme_name", "Scheme I (ISI Mark Certification Scheme)"),
            "details": certification_guidance.get("scheme_description", "Factory inspection + third-party sample testing required for CML license.")
        },
        {
            "step_number": 4,
            "title": "Mandatory Laboratory Testing",
            "status": "IN_PROGRESS" if testing_information else "PENDING",
            "summary": f"{len(testing_information)} Key Safety & Quality Parameters Identified",
            "details": ", ".join([t.get("test_name", "") for t in testing_information[:3]]) if testing_information else "Testing parameters depend on identified standard."
        },
        {
            "step_number": 5,
            "title": "Recognized Test Laboratory Discovery",
            "status": "COMPLETED" if laboratories else "PENDING",
            "summary": f"{len(laboratories)} BIS Recognized NABL Labs Available",
            "details": f"Nearby facility: {laboratories[0]['name']} ({laboratories[0].get('city', laboratories[0].get('location', 'India'))})" if laboratories else "Search laboratories by location and standard capability."
        },
        {
            "step_number": 6,
            "title": "BIS Portal Application & License Grant",
            "status": "PENDING",
            "summary": "Submit Application via Manakonline Portal",
            "details": "Upload lab test reports, factory QC details, pay marking fee, and schedule BIS officer inspection."
        }
    ]
    
    return {
        "product_name": product_name,
        "current_stage": 2 if len(recommended_standards) > 0 else 1,
        "is_mandatory_certification": recommended_standards[0].get("is_mandatory", True) if recommended_standards else False,
        "steps": journey_steps
    }
