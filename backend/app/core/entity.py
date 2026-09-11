import re
from typing import Dict, Any, Optional

MATERIALS = [
    "stainless steel", "steel", "gold", "silver", "cement", "concrete", "plastic",
    "copper", "aluminum", "silicone", "glass", "wood", "rubber", "lithium-ion", "lithium"
]

CANONICAL_PRODUCT_MAP = {
    "mobile": "Mobile Phone",
    "mobile phone": "Mobile Phone",
    "mobile phones": "Mobile Phone",
    "smartphone": "Mobile Phone",
    "smartphones": "Mobile Phone",
    "cell phone": "Mobile Phone",
    "cellphone": "Mobile Phone",
    "handset": "Mobile Phone",
    "charger": "Power Adapter",
    "mobile charger": "Power Adapter",
    "power adapter": "Power Adapter",
    "adapter": "Power Adapter",
    "fast charger": "Power Adapter",
    "pressure cooker": "Pressure Cooker",
    "cooker": "Pressure Cooker",
    "pressure cookers": "Pressure Cooker",
    "water bottle": "Water Bottle",
    "bottle": "Water Bottle",
    "water bottles": "Water Bottle",
    "flask": "Water Bottle",
    "flasks": "Water Bottle",
    "vacuum flask": "Water Bottle",
    "kettle": "Kettle",
    "electric kettle": "Kettle",
    "kettles": "Kettle",
    "boiling water appliance": "Kettle",
    "helmet": "Protective Helmet",
    "helmets": "Protective Helmet",
    "motorcycle helmet": "Protective Helmet",
    "biker helmet": "Protective Helmet",
    "battery": "Secondary Lithium-ion Battery",
    "batteries": "Secondary Lithium-ion Battery",
    "lithium battery": "Secondary Lithium-ion Battery",
    "li-ion battery": "Secondary Lithium-ion Battery",
    "mobile battery": "Secondary Lithium-ion Battery",
    "power bank": "Power Bank",
    "led bulb": "LED Bulb",
    "led light": "LED Bulb",
    "led lamp": "LED Bulb",
    "bulb": "LED Bulb",
    "toy": "Safety of Toys",
    "toys": "Safety of Toys",
    "children toy": "Safety of Toys",
    "gold jewellery": "Gold Jewellery & Artefacts",
    "jewellery": "Gold Jewellery & Artefacts",
    "jewelry": "Gold Jewellery & Artefacts",
    "gold": "Gold Jewellery & Artefacts",
    "hallmark": "Gold Jewellery & Artefacts",
    "huid": "Gold Jewellery & Artefacts",
    "laptop": "Laptop / Notebook Computer",
    "notebook": "Laptop / Notebook Computer",
    "computer": "Laptop / Notebook Computer",
    "cement": "Portland Pozzolana Cement",
    "paver block": "Concrete Paver Block",
    "washing machine": "Electric Clothes Washing Machine",
    "geyser": "Stationary Electric Water Heater"
}

USES = [
    "everyday use", "household", "consumer use", "industrial", "structural",
    "construction", "commercial", "drinking water storage", "heating liquids", "telecommunication", "lighting"
]

INDUSTRIES = [
    "Consumer Durables", "Precious Metals", "Construction & Building Materials",
    "Electrical & Electronics", "Heavy Manufacturing", "Chemicals", "Automotive & Road Safety"
]

def extract_product_entities(message: str, existing_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    text_lower = message.lower().strip()
    
    extracted = {
        "product": existing_profile.get("product") if existing_profile else None,
        "material": existing_profile.get("material") if existing_profile else None,
        "intended_use": existing_profile.get("intended_use") if existing_profile else None,
        "target_user": existing_profile.get("target_user") if existing_profile else "Consumer",
        "industry": existing_profile.get("industry") if existing_profile else None,
        "market": existing_profile.get("market") if existing_profile else "India",
        "location": existing_profile.get("location") if existing_profile else "India"
    }

    # 1. Check in-memory CANONICAL_PRODUCT_MAP first for canonical titles
    for key in sorted(CANONICAL_PRODUCT_MAP.keys(), key=len, reverse=True):
        pattern = r"\b" + re.escape(key) + r"\b"
        if re.search(pattern, text_lower):
            extracted["product"] = CANONICAL_PRODUCT_MAP[key]
            break

    # 2. Try matching against database product aliases if not matched
    if not extracted["product"]:
        try:
            from backend.app.db.session import SessionLocal
            from backend.app.db.models import ProductModel, ProductAliasModel
            db = SessionLocal()
            try:
                aliases = db.query(ProductAliasModel).all()
                for al in sorted(aliases, key=lambda x: len(x.alias), reverse=True):
                    pattern = r"\b" + re.escape(al.alias) + r"\b"
                    if re.search(pattern, text_lower):
                        prod = db.query(ProductModel).filter(ProductModel.id == al.product_id).first()
                        if prod:
                            extracted["product"] = prod.name
                            extracted["industry"] = prod.category
                            break
            finally:
                db.close()
        except Exception:
            pass

    # Material extraction
    for mat in MATERIALS:
        pattern = r"\b" + re.escape(mat) + r"\b"
        if re.search(pattern, text_lower):
            extracted["material"] = mat.title()
            break

    # Intended use extraction
    for u in USES:
        if u in text_lower:
            extracted["intended_use"] = u.title()
            break

    # Heuristic industry assignment
    if extracted["product"]:
        p_low = extracted["product"].lower()
        if "mobile" in p_low or "laptop" in p_low or "adapter" in p_low or "charger" in p_low:
            extracted["industry"] = "Electronics & IT Goods"
            if not extracted["intended_use"]:
                extracted["intended_use"] = "Personal Computing & Communication"
        elif "cooker" in p_low:
            extracted["industry"] = "Kitchenware & Domestic Appliances"
            if not extracted["intended_use"]:
                extracted["intended_use"] = "Domestic Food Cooking Under Steam Pressure"
        elif "bottle" in p_low or "flask" in p_low:
            extracted["industry"] = "Consumer Durables"
            if not extracted["intended_use"]:
                extracted["intended_use"] = "Everyday Consumer Beverage Storage"
        elif "kettle" in p_low or "appliance" in p_low:
            extracted["industry"] = "Household Electrical Appliances"
            if not extracted["intended_use"]:
                extracted["intended_use"] = "Domestic Liquid Heating"
        elif "jewell" in p_low or "gold" in p_low:
            extracted["industry"] = "Precious Metals & Hallmarking"
        elif "cement" in p_low or "paver" in p_low:
            extracted["industry"] = "Construction Materials"
        elif "helmet" in p_low:
            extracted["industry"] = "Automotive & Road Safety"
            if not extracted["intended_use"]:
                extracted["intended_use"] = "Rider Head Protection"
        elif "toy" in p_low:
            extracted["industry"] = "Child Care & Toys"

    return extracted
