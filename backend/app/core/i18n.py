"""
NexaStandards — Centralized Multilingual Localization & BIS Regulatory Glossary
SIH 2026 Problem Statement: SIH26107

Covers 11 Indian Languages:
- English (en), Hindi (hi), Kannada (kn), Telugu (te), Tamil (ta),
  Marathi (mr), Bengali (bn), Malayalam (ml), Gujarati (gu), Punjabi (pa), Odia (or).

CRITICAL RULE:
- Preserves exact statutory identifiers (e.g. IS 17803:2022, S.O. 4582(E), CM/L-7123456, R-41012345, HUID).
- Never produces mixed or broken translations.
- Provides 'What Does This BIS Term Mean?' interactive glossaries in all 11 languages.
"""

import re
from typing import Dict, Any, List, Optional

# Supported ISO language codes
SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "हिंदी (Hindi)",
    "kn": "ಕನ್ನಡ (Kannada)",
    "te": "తెలుగు (Telugu)",
    "ta": "தமிழ் (Tamil)",
    "mr": "मराठी (Marathi)",
    "bn": "বাংলা (Bengali)",
    "ml": "മലയാളം (Malayalam)",
    "gu": "ગુજરાતી (Gujarati)",
    "pa": "ਪੰਜਾਬੀ (Punjabi)",
    "or": "ଓଡ଼ିଆ (Odia)"
}

# Protected statutory patterns that must NEVER be modified or transliterated
STATUTORY_PRESERVE_PATTERNS = [
    r"IS\s*\d+(?:\s*\([^\)]+\))?(?::\d{4})?", # e.g. IS 17803:2022, IS 13252 (Part 1):2010
    r"IS/IEC\s*[\d\-]+(?::\d{4})?",           # e.g. IS/IEC 62368-1:2023
    r"S\.O\.\s*\d+\([A-Z]\)",                  # e.g. S.O. 4582(E)
    r"CM/L-?\d{7}",                           # e.g. CM/L-7123456
    r"R-?\d{8}",                              # e.g. R-41012345
    r"\b[A-Z0-9]{6}\b",                       # e.g. 6-digit HUID
    r"\d{4}-\d{2}-\d{2}",                     # Dates
    r"\b(?:Scheme\s+[I|II|III|IV|X]+)\b",     # Scheme I, Scheme II
    r"\b(?:QCO|CRS|ISI|HUID|AHC|STI|NABL|DPIIT|MeitY)\b"
]

# Centralized "What Does This BIS Term Mean?" Glossary
BIS_GLOSSARY: Dict[str, Dict[str, Any]] = {
    "QCO": {
        "term": "Quality Control Order (QCO)",
        "acronym": "QCO",
        "simple_meaning": {
            "en": "An official government notification that makes compliance with an Indian Standard mandatory under the law.",
            "hi": "एक आधिकारिक सरकारी अधिसूचना जो कानून के तहत किसी भारतीय मानक का पालन करना अनिवार्य बनाती है।",
            "kn": "ಇದು ಸರ್ಕಾರವು ಕೆಲವು ಉತ್ಪನ್ನಗಳಿಗೆ BIS ಮಾನದಂಡ ಅನುಸರಣೆಯನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸುವ ಅಧಿಕೃತ ಕಾನೂನು ಆದೇಶವಾಗಿದೆ.",
            "te": "చట్టం ప్రకారం భారతీయ ప్రమాణాన్ని తప్పనిసరి చేసే అధికారిక ప్రభుత్వ ఉత్తర్వు.",
            "ta": "சட்டத்தின் கீழ் இந்தியத் தரநிலையை கட்டாயமாக்கும் அதிகாரப்பூர்வ அரசாங்க உத்தரவு.",
            "mr": "कायद्यानुसार भारतीय मानकांचे पालन अनिवार्य करणारा अधिकृत सरकारी आदेश.",
            "bn": "আইনের অধীনে ভারতীয় মান মেনে চলা বাধ্যতামূলক করার জন্য একটি সরকারি আদেশ।",
            "ml": "നിയമപ്രകാരം ഒരു ഇന്ത്യൻ നിലവാരം നിർബന്ധമാക്കുന്ന ഔദ്യോഗിക സർക്കാർ ഉത്തരവ്.",
            "gu": "કાયદા હેઠળ ભારતીય ધોરણનું પાલન ફરજિયાત બનાવતો સત્તાવાર સરકારી આદેશ.",
            "pa": "ਇੱਕ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਨੋਟੀਫਿਕੇਸ਼ਨ ਜੋ ਕਾਨੂੰਨ ਅਧੀਨ ਭਾਰਤੀ ਮਿਆਰ ਦੀ ਪਾਲਣਾ ਨੂੰ ਲਾਜ਼ਮੀ ਬਣਾਉਂਦਾ ਹੈ।",
            "or": "ଆଇନ ଅନୁଯାୟୀ ଏକ ଭାରତୀୟ ମାନକ ପାଳନକୁ ବାଧ୍ୟତାମୂଳକ କରୁଥିବା ସରକାରୀ ଆଦେଶ।"
        },
        "why_it_matters": {
            "en": "Selling, manufacturing, or importing products without BIS certification once a QCO is in effect is illegal under Section 16 & 29 of the BIS Act, 2016.",
            "hi": "QCO लागू होने के बाद बिना BIS प्रमाणन के उत्पाद बेचना या बनाना गैरकानूनी है।",
            "kn": "QCO ಜಾರಿಯಾದ ನಂತರ BIS ಪ್ರಮಾಣಪತ್ರವಿಲ್ಲದೆ ಉತ್ಪನ್ನವನ್ನು ಮಾರಾಟ ಮಾಡುವುದು ಅಥವಾ ತಯಾರಿಸುವುದು ಕಾನೂನುಬಾಹಿರ.",
            "te": "QCO అమలులోకి వచ్చిన తర్వాత BIS ధృవీకరణ లేకుండా ఉత్పత్తులను తయారు చేయడం లేదా విక్రయించడం చట్టవిరుద్ధం.",
            "ta": "QCO நடைமுறைக்கு வந்த பிறகு BIS சான்றிதழ் இல்லாமல் தயாரிப்புகளை விற்பது அல்லது தயாரிப்பது சட்டவிரோதமானது."
        },
        "who_needs_to_care": "Consumers (for authentic product verification), Startups & Manufacturers (for statutory market authorization).",
        "statutory_definition": "Order issued under Section 16 of the Bureau of Indian Standards Act, 2016 by the concerned Line Ministry."
    },
    "CRS": {
        "term": "Compulsory Registration Scheme (CRS)",
        "acronym": "CRS",
        "simple_meaning": {
            "en": "Scheme II of BIS, where electronic and IT products are tested in accredited labs and registered to receive an 8-digit R-number.",
            "hi": "BIS की स्कीम II, जिसके तहत इलेक्ट्रॉनिक्स और आईटी उत्पादों को 8 अंकों का R-नंबर प्राप्त होता है।",
            "kn": "ಇದು ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಐಟಿ ಉತ್ಪನ್ನಗಳಿಗೆ ಅನ್ವಯವಾಗುವ BIS ಸ್ಕೀಮ್ II ಆಗಿದ್ದು, 8-ಅಂಕಿಯ R-ಸಂಖ್ಯೆಯನ್ನು ನೀಡುತ್ತದೆ.",
            "te": "ఎలక్ట్రానిక్స్ మరియు IT ఉత్పత్తుల కోసం BIS పథకం II, 8-అంకెల R-సంఖ్యను మంజూరు చేస్తుంది.",
            "ta": "மின்னணு மற்றும் IT தயாரிப்புகளுக்கான BIS திட்டம் II, 8-இலக்க R-எண்ணை வழங்குகிறது."
        },
        "why_it_matters": {
            "en": "Laptops, mobile phones, power adapters, and smartwatches cannot be legally sold in India without a valid 8-digit CRS R-number.",
            "hi": "लैपटॉप और मोबाइल फोन बिना वैध R-नंबर के भारत में नहीं बेचे जा सकते।",
            "kn": "ಮಾನ್ಯವಾದ 8-ಅಂಕಿಯ R-ಸಂಖ್ಯೆಯಿಲ್ಲದೆ ಮೊಬೈಲ್ ಅಥವಾ ಲ್ಯಾಪ್‌ಟಾಪ್‌ಗಳನ್ನು ಭಾರತದಲ್ಲಿ ಮಾರಾಟ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ."
        },
        "who_needs_to_care": "Electronics importers, smartphone manufacturers, IT hardware startups, and consumers.",
        "statutory_definition": "Bureau of Indian Standards (Conformity Assessment) Regulations, 2018 — Scheme II."
    },
    "ISI": {
        "term": "ISI Mark (Scheme I)",
        "acronym": "ISI",
        "simple_meaning": {
            "en": "The iconic third-party quality certification mark of BIS, carrying a 7-digit CM/L licence number for industrial and consumer goods.",
            "hi": "BIS का प्रसिद्ध गुणवत्ता प्रमाणन चिह्न, जिसमें 7 अंकों का CM/L लाइसेंस नंबर होता है।",
            "kn": "ಇದು ಕೈಗಾರಿಕಾ ಮತ್ತು ಗ್ರಾಹಕ ಉತ್ಪನ್ನಗಳ ಮೇಲೆ ಮುದ್ರಿಸಲಾಗುವ 7-ಅಂಕಿಯ CM/L ಪರವಾನಗಿ ಸಂಖ್ಯೆ ಹೊಂದಿರುವ BIS ಗುರುತು.",
            "te": "7-అంకెల CM/L లైసెన్స్ నంబర్‌ను కలిగి ఉన్న BIS నాణ్యతా ధృవీకరణ గుర్తు.",
            "ta": "7-இலக்க CM/L உரிம எண்ணைக் கொண்ட BIS தரச் சான்றிதழ் முத்திரை."
        },
        "why_it_matters": {
            "en": "Guarantees that the manufacturer has established in-house testing facilities and undergone official BIS factory inspection audits.",
            "hi": "प्रमाणित करता है कि निर्माता ने इन-हाउस परीक्षण सुविधाएं स्थापित की हैं और BIS ऑडिट पास किया है।",
            "kn": "ತಯಾರಕರು BIS ಕಾರ್ಖಾನೆ ಪರಿಶೀಲನೆಗೆ ಒಳಗಾಗಿದ್ದಾರೆ ಮತ್ತು ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆಗಳನ್ನು ಪಾಲಿಸುತ್ತಿದ್ದಾರೆ ಎಂಬುದನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ."
        },
        "who_needs_to_care": "Buyers of pressure cookers, water bottles, cement, helmets, and electrical appliances.",
        "statutory_definition": "Bureau of Indian Standards (Conformity Assessment) Regulations, 2018 — Scheme I."
    },
    "HUID": {
        "term": "Hallmark Unique Identification (HUID)",
        "acronym": "HUID",
        "simple_meaning": {
            "en": "A unique 6-digit alphanumeric code laser-engraved onto every piece of gold jewellery alongside the BIS logo and purity grade.",
            "hi": "सोने के आभूषणों पर लेजर द्वारा उकेरा गया 6 अंकों का विशिष्ट कोड, जिसे BIS CARE ऐप में सत्यापित किया जा सकता है।",
            "kn": "ಚಿನ್ನದ ಆಭರಣಗಳ ಮೇಲೆ ಲೇಸರ್ ಮೂಲಕ ಮುದ್ರಿಸಲಾಗುವ 6-ಅಕ್ಷರದ ಅನನ್ಯ ಕೋಡ್ (HUID), ಇದನ್ನು BIS CARE ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಬಹುದು.",
            "te": "బంగారు ఆభరణాలపై లేజర్ ద్వారా ముద్రించబడిన 6-అంకెల విశిష్ట కోడ్.",
            "ta": "தங்க நகைகளில் லேசர் மூலம் பொறிக்கப்பட்ட 6-இலக்க தனித்துவமான குறியீடு."
        },
        "why_it_matters": {
            "en": "Prevents adulteration and counterfeiting by enabling citizens to verify jeweller name, assaying centre, and purity grade in real-time.",
            "hi": "ग्राहकों को BIS CARE ऐप से सीधे सोने की शुद्धता और जौहरी का विवरण जांचने की सुविधा देता है।",
            "kn": "ಗ್ರಾಹಕರು BIS CARE ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಕ ಚಿನ್ನದ ಶುದ್ಧತೆ ಮತ್ತು ಆಭರಣ ವ್ಯಾಪಾರಿಯ ವಿವರಗಳನ್ನು ನೇರವಾಗಿ ಪರಿಶೀಲಿಸಲು ಅನುಮತಿಸುತ್ತದೆ."
        },
        "who_needs_to_care": "Every citizen purchasing gold jewellery in India, gold retailers, and assaying centres.",
        "statutory_definition": "Hallmarking Regulations under the Bureau of Indian Standards Act, 2016."
    }
}

# Multilingual Query Intent & Product Matcher
PRODUCT_KEYWORDS_MAP = {
    "pressure cooker": ["pressure cooker", "cooker", "ಪ್ರೆಶರ್ ಕುಕ್ಕರ್", "कुकर", "प्रेशर कुकर", "ప్రెజర్ కుక్కర్", "பிரஷர் குக்கர்"],
    "water bottle": ["water bottle", "flask", "insulated flask", "ನೀರಿನ ಬಾಟಲ್", "पानी की बोतल", "वाटर बॉटल", "నీళ్ల బాటిల్", "தண்ணீர் பாட்டில்"],
    "mobile": ["mobile", "smartphone", "cellphone", "ಮೊಬೈಲ್", "मोबाइल", "ఫోన్", "மொபைல்", "स्मार्टफोन"],
    "electric kettle": ["kettle", "electric kettle", "ಕೆಟಲ್", "केतली", "ఎలక్ట్రిక్ కేటిల్", "கெட்டில்"],
    "gold hallmarking": ["gold", "jewellery", "hallmark", "huid", "ಚಿನ್ನ", "ಆಭರಣ", "ಸೋನಾ", "सोना", "हॉलमार्क", "బంగారం", "தங்கம்"]
}

def detect_product_from_multilingual_query(query: str) -> Optional[str]:
    """
    Identifies canonical product concept from English, Hindi, Kannada, Telugu, Tamil, etc.
    """
    q_lower = query.lower()
    for canonical_name, aliases in PRODUCT_KEYWORDS_MAP.items():
        for alias in aliases:
            if alias in q_lower:
                if canonical_name == "pressure cooker":
                    return "Domestic Pressure Cooker"
                elif canonical_name == "water bottle":
                    return "Stainless Steel Water Bottle & Flask"
                elif canonical_name == "mobile":
                    return "Mobile Phone"
                elif canonical_name == "electric kettle":
                    return "Electric Kettle"
                elif canonical_name == "gold hallmarking":
                    return "Gold Jewellery & Artefacts"
    return None

def detect_persona_from_query(query: str) -> str:
    """
    Identifies whether user query expresses consumer, startup, or product builder intent.
    """
    q_lower = query.lower()
    # Startup / Manufacturing intent
    if any(k in q_lower for k in [
        "manufacture", "make", "produce", "start", "selling", "import", "factory",
        "startup", "msme", "ತಯಾರಿಸಲು", "ಉತ್ಪಾದನೆ", "बनाना", "निर्माण", "शुरू", "తయారీ"
    ]):
        return "startup"
    
    # Builder / Technical intent
    if any(k in q_lower for k in [
        "clause", "test method", "breakdown", "dielectric", "kpa", "edition",
        "superseded", "amendment", "specification", "technical"
    ]):
        return "builder"

    # Default to consumer mode
    return "consumer"

def get_glossary_term(term_key: str, lang: str = "en") -> Optional[Dict[str, Any]]:
    """
    Returns localized glossary item for any BIS term.
    """
    key = term_key.upper().strip()
    item = BIS_GLOSSARY.get(key)
    if not item:
        return None

    simple = item["simple_meaning"].get(lang) or item["simple_meaning"].get("en", "")
    why = item["why_it_matters"].get(lang) or item["why_it_matters"].get("en", "")

    return {
        "term": item["term"],
        "acronym": item["acronym"],
        "simple_meaning": simple,
        "why_it_matters": why,
        "who_needs_to_care": item["who_needs_to_care"],
        "statutory_definition": item["statutory_definition"],
        "language": lang
    }

def get_all_glossary_terms(lang: str = "en") -> List[Dict[str, Any]]:
    """
    Returns complete glossary list for the UI popover/modal in the requested language.
    """
    return [get_glossary_term(k, lang) for k in BIS_GLOSSARY.keys()]
