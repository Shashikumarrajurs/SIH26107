from typing import Dict, Any, List

def build_bis_journey(
    product_profile: Dict[str, Any],
    recommended_standards: List[Dict[str, Any]],
    certification_guidance: Dict[str, Any],
    testing_information: List[Dict[str, Any]],
    laboratories: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Builds a dynamic 6-stage BIS journey tailored to the specific product and standards,
    with crystal-clear, plain-language guidance accessible to common citizens, MSMEs, and startups.
    """
    product_name = product_profile.get("product") or "Specified Product"
    material = product_profile.get("material") or ""
    p_name_low = product_name.lower()
    
    raw_scheme = (
        certification_guidance.get("scheme_name") or 
        certification_guidance.get("scheme") or 
        ""
    )
    
    is_crs = (
        "crs" in raw_scheme.lower() or 
        "scheme ii" in raw_scheme.lower() or 
        any(k in p_name_low for k in ["mobile", "phone", "laptop", "tablet", "it equipment", "computer", "battery", "power bank", "charger", "led lamp"])
    )
    is_hallmark = (
        "hallmark" in raw_scheme.lower() or 
        any(k in p_name_low for k in ["gold", "silver", "jewel", "artefact"])
    )

    primary_std_num = recommended_standards[0]['standard_number'] if recommended_standards else "Indian Standard (IS)"
    primary_std_title = recommended_standards[0]['title'] if recommended_standards else "Standard technical specifications under BIS Act, 2016."

    # Stage 3 Configuration
    if is_crs:
        s3_summary = "Scheme II (Compulsory Registration Scheme - CRS)"
        s3_details = "Self-declaration of conformity based on laboratory safety tests. NO factory visit required."
        s3_mark = "CRS Logo with unique 8-digit R-Number (e.g. R-41012345)"
        s3_plain = "Electronics are certified under Scheme II (CRS). BIS does NOT visit your factory; you only need to pass safety tests at a recognized lab."
    elif is_hallmark:
        s3_summary = "Scheme IV (Hallmarking & Assaying Scheme)"
        s3_details = "Mandatory jeweller registration & laser assaying at recognized AHC centers."
        s3_mark = "3 Hallmarks: BIS Logo + Purity Grade (e.g. 22K916) + 6-character HUID"
        s3_plain = "Gold jewellery must carry the 3 official hallmarks: BIS triangular mark, purity grade (e.g. 22K916), and unique 6-digit HUID code."
    else:
        s3_summary = "Scheme I (ISI Mark Certification Scheme)"
        s3_details = "Third-party lab testing + preliminary factory audit by BIS officers for CM/L license."
        s3_mark = "Official ISI Mark with 7-digit CM/L license number"
        s3_plain = "Products like helmets, cookers, cement, and bottles require lab testing plus a factory audit visit by a BIS inspection officer."

    # Stage 4 Configuration (Testing)
    if testing_information:
        test_count = len(testing_information)
        test_names = " • ".join([t.get("test_name", "") for t in testing_information[:3]])
        s4_summary = f"{test_count} Mandatory Safety & Quality Tests Identified"
        s4_details = test_names
        s4_plain = "Your product sample must pass strict safety tests (e.g. shock protection, fire prevention, impact resistance) at an accredited lab before you can sell it."
    elif is_crs:
        s4_summary = "3 Mandatory Electronics Safety Tests Required"
        s4_details = "Electric Shock & Dielectric Insulation • Lithium Battery Thermal Safety • 22 Indian Language Display"
        s4_plain = "Mobile phones and chargers must prove they will not shock users, catch fire while charging, or fail during accidental drops."
    else:
        s4_summary = "Mandatory Quality & Safety Verification Tests"
        s4_details = "Routine factory verification, dimensional tolerance, and material safety tests under the BIS Act."
        s4_plain = "Samples must pass laboratory verification to prove they are safe, durable, and free from harmful impurities."

    # Stage 6 Configuration (Portal & License)
    if is_crs:
        s6_summary = "Apply Online on BIS CRS Portal (crsbis.in)"
        s6_details = "Upload NABL lab test reports, register brand/model on crsbis.in, pay fee, and get online grant of 8-digit R-Number (No factory inspection!)."
        s6_plain = "Apply online at crsbis.in with your lab test report. Once approved, print the R-Number on the phone or box and start selling legally."
    elif is_hallmark:
        s6_summary = "Online Registration at Manakonline e-Hallmarking"
        s6_details = "Instant online registration certificate for jewelers; send jewellery pieces to recognized AHC for laser HUID engraving."
        s6_plain = "Jewellers register online at manakonline.in to get licensed, then send gold items to an Assaying Centre for laser HUID marking."
    else:
        s6_summary = "Submit Application via Manakonline Portal (manakonline.in)"
        s6_details = "Submit Form V, upload lab test reports, factory QC details, pay marking fee, and complete BIS officer factory inspection."
        s6_plain = "Apply online at manakonline.in with test reports. A BIS officer inspects your factory before issuing your 7-digit CM/L license number."

    journey_steps = [
        {
            "step_number": 1,
            "short_label": "1. Product Scope",
            "title": "Product Scope & Classification",
            "status": "COMPLETED" if product_profile.get("product") else "IN_PROGRESS",
            "summary": f"Product: {product_name} {f'({material})' if material else ''}",
            "details": f"Market: {product_profile.get('market', 'India')} | Category: {product_profile.get('industry', 'Consumer Goods')}",
            "plain_language": "Find out what product you are selling or buying, its materials, and whether Indian quality laws apply."
        },
        {
            "step_number": 2,
            "short_label": "2. BIS Standard",
            "title": "Indian Standard Identification",
            "status": "COMPLETED" if recommended_standards else "ACTION_REQUIRED",
            "summary": f"Primary Standard: {primary_std_num}",
            "details": f"Title: {primary_std_title}",
            "plain_language": "Find the official BIS safety specification that your product must obey under Indian law."
        },
        {
            "step_number": 3,
            "short_label": "3. Scheme Type",
            "title": "Conformity Scheme Selection",
            "status": "IN_PROGRESS" if recommended_standards else "PENDING",
            "summary": s3_summary,
            "details": s3_details,
            "mark": s3_mark,
            "plain_language": s3_plain
        },
        {
            "step_number": 4,
            "short_label": "4. Lab Testing",
            "title": "Mandatory Laboratory Testing",
            "status": "IN_PROGRESS" if (testing_information or recommended_standards) else "PENDING",
            "summary": s4_summary,
            "details": s4_details,
            "plain_language": s4_plain
        },
        {
            "step_number": 5,
            "short_label": "5. NABL Labs",
            "title": "Recognized Test Laboratory Discovery",
            "status": "COMPLETED" if laboratories else "PENDING",
            "summary": f"{len(laboratories)} BIS Recognized NABL Labs Available",
            "details": f"Nearby facility: {laboratories[0]['name']} ({laboratories[0].get('city', laboratories[0].get('location', 'Delhi NCR'))})" if laboratories else "Search laboratories by location and standard capability.",
            "plain_language": "Send sample units to any BIS-recognized or NABL-accredited test lab to receive your official test report."
        },
        {
            "step_number": 6,
            "short_label": "6. BIS License",
            "title": "Online Registration & License Grant",
            "status": "PENDING",
            "summary": s6_summary,
            "details": s6_details,
            "plain_language": s6_plain
        }
    ]
    
    return {
        "product_name": product_name,
        "current_stage": 2 if len(recommended_standards) > 0 else 1,
        "is_mandatory_certification": recommended_standards[0].get("is_mandatory", True) if recommended_standards else True,
        "steps": journey_steps
    }
