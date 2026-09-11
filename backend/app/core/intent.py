import re
from typing import Dict, Any

INTENT_PATTERNS = {
    "UNSUPPORTED_QUERY": [
        r"warp drive", r"quantum space thruster", r"mars orbit", r"alien technology",
        r"time travel", r"flux capacitor", r"lightsaber", r"antigravity vehicle"
    ],
    "GRIEVANCE": [
        r"complaint", r"grievance", r"report fake", r"substandard", r"defective",
        r"cheated", r"file complaint", r"fraudulent mark", r"misuse of bis mark",
        r"शिकायत", r"फर्जी"
    ],
    "PRODUCT_VERIFICATION": [
        r"verify product", r"check mark", r"is this product genuine", r"genuine mark",
        r"cml-", r"cm/l", r"r-\d{8}", r"verify my product", r"fake bis mark", r"सत्यापित"
    ],
    "ISI_VERIFICATION": [
        r"verify isi", r"isi mark genuine", r"isi logo", r"cml number", r"cml check"
    ],
    "CRS_VERIFICATION": [
        r"crs number", r"crs registration", r"r-number", r"r number", r"check crs"
    ],
    "HALLMARKING": [
        r"hallmark", r"gold jewellery", r"gold hallmark", r"silver hallmark", r"huid",
        r"22k916", r"carat", r"karat", r"assaying", r"हॉलमार्क", r"सोना", r"हुइड"
    ],
    "TESTING": [
        r"what tests", r"tests are required", r"test requirements", r"testing procedure",
        r"testing clause", r"parameters to test", r"dielectric test", r"thermal test",
        r"burst pressure test", r"परीक्षण"
    ],
    "LAB_SEARCH": [
        r"laboratory", r"testing lab", r"find a lab", r"nabl lab", r"bis recognized lab",
        r"where can i test", r"test facility", r"sahibabad", r"प्रयोगशाला", r"लैब"
    ],
    "QCO_SEARCH": [
        r"qco", r"quality control order", r"dpiit qco", r"mandatory qco", r"government order"
    ],
    "GAZETTE_SEARCH": [
        r"gazette", r"s\.o\.", r"gazette notification", r"supersession order", r"राजपत्र"
    ],
    "AMENDMENT_SEARCH": [
        r"amendment", r"amended", r"latest amendment", r"amd 1", r"amd 2", r"संशोधन"
    ],
    "COMPARISON": [
        r"compare", r"difference between", r"vs\b", r"versus", r"comparison"
    ],
    "CERTIFICATION": [
        r"certification", r"certify", r"how to get bis", r"how do i get bis",
        r"grant of license", r"scheme i\b", r"scheme ii\b", r"crs scheme", r"प्रमाणन",
        r"licensing", r"application fee"
    ],
    "STANDARD_RECOMMENDATION": [
        r"what standard applies", r"which standard applies", r"standard for",
        r"what bis standard", r"which bis standard", r"recommend a standard",
        r"i manufacture", r"i make", r"standard may apply to my product",
        r"मानक", r"ಸ್ಟ್ಯಾಂಡರ್ಡ್", r"ಮಾನದಂಡ"
    ],
    "STANDARD_SEARCH": [
        r"\bis \d+", r"is/iec", r"indian standard", r"view standard", r"clause"
    ],
    "PRODUCT_SEARCH": [
        r"^mobile$", r"^phone$", r"^mobile phone$", r"^charger$", r"^pressure cooker$",
        r"^water bottle$", r"^helmet$", r"^battery$", r"^toy$", r"^laptop$",
        r"^led bulb$", r"bis for mobile", r"bis for cooker", r"bis for charger"
    ],
    "MULTILINGUAL_QUERY": [
        r"[\u0900-\u097F]", # Devanagari (Hindi, Marathi)
        r"[\u0C80-\u0CFF]", # Kannada
        r"[\u0B80-\u0BFF]", # Tamil
        r"[\u0C00-\u0C7F]", # Telugu
        r"[\u0980-\u09FF]", # Bengali
        r"[\u0D00-\u0D7F]"  # Malayalam
    ]
}

def classify_intent(message: str) -> Dict[str, Any]:
    text_clean = message.lower().strip()
    
    # 1. Immediate check for unsupported / fictional query
    for pat in INTENT_PATTERNS["UNSUPPORTED_QUERY"]:
        if re.search(pat, text_clean):
            return {"intent": "UNSUPPORTED_QUERY", "confidence": 0.99}

    # 2. Check for explicit grievance
    for pat in INTENT_PATTERNS["GRIEVANCE"]:
        if re.search(pat, text_clean):
            return {"intent": "GRIEVANCE", "confidence": 0.95}

    # 3. Check for specific testing queries
    for pat in INTENT_PATTERNS["TESTING"]:
        if re.search(pat, text_clean):
            return {"intent": "TESTING", "confidence": 0.95}

    # 4. Check for lab search
    for pat in INTENT_PATTERNS["LAB_SEARCH"]:
        if re.search(pat, text_clean):
            return {"intent": "LAB_SEARCH", "confidence": 0.95}

    # 5. Check for hallmarking
    for pat in INTENT_PATTERNS["HALLMARKING"]:
        if re.search(pat, text_clean):
            return {"intent": "HALLMARKING", "confidence": 0.95}

    # 6. Check for verification queries
    for pat in INTENT_PATTERNS["PRODUCT_VERIFICATION"]:
        if re.search(pat, text_clean):
            return {"intent": "PRODUCT_VERIFICATION", "confidence": 0.95}

    # 7. Check for standard recommendation / discovery
    for pat in INTENT_PATTERNS["STANDARD_RECOMMENDATION"]:
        if re.search(pat, text_clean):
            return {"intent": "STANDARD_RECOMMENDATION", "confidence": 0.95}

    # 8. Check for certification queries
    for pat in INTENT_PATTERNS["CERTIFICATION"]:
        if re.search(pat, text_clean):
            return {"intent": "CERTIFICATION", "confidence": 0.93}

    # 9. Check for QCO / Gazette / Amendments
    for pat in INTENT_PATTERNS["QCO_SEARCH"]:
        if re.search(pat, text_clean):
            return {"intent": "QCO_SEARCH", "confidence": 0.92}
    for pat in INTENT_PATTERNS["GAZETTE_SEARCH"]:
        if re.search(pat, text_clean):
            return {"intent": "GAZETTE_SEARCH", "confidence": 0.92}
    for pat in INTENT_PATTERNS["AMENDMENT_SEARCH"]:
        if re.search(pat, text_clean):
            return {"intent": "AMENDMENT_SEARCH", "confidence": 0.92}

    # 10. Check for comparison
    for pat in INTENT_PATTERNS["COMPARISON"]:
        if re.search(pat, text_clean):
            return {"intent": "COMPARISON", "confidence": 0.92}

    # 11. Check for concise product search
    for pat in INTENT_PATTERNS["PRODUCT_SEARCH"]:
        if re.search(pat, text_clean):
            return {"intent": "PRODUCT_SEARCH", "confidence": 0.95}

    # 12. Standard code search
    for pat in INTENT_PATTERNS["STANDARD_SEARCH"]:
        if re.search(pat, text_clean):
            return {"intent": "STANDARD_SEARCH", "confidence": 0.90}

    # 13. Multilingual script detection
    for pat in INTENT_PATTERNS["MULTILINGUAL_QUERY"]:
        if re.search(pat, message):
            return {"intent": "STANDARD_RECOMMENDATION", "confidence": 0.88, "is_multilingual": True}

    # Fallback to general query
    if len(text_clean.split()) > 1:
        return {"intent": "STANDARD_RECOMMENDATION", "confidence": 0.70}

    return {"intent": "PRODUCT_SEARCH", "confidence": 0.60}
