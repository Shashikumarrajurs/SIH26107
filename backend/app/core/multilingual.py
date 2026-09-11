from typing import Dict, Any

LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "kn": "Kannada",
    "ta": "Tamil",
    "te": "Telugu",
    "bn": "Bengali",
    "mr": "Marathi",
    "ml": "Malayalam"
}

# Multi-lingual UI greetings and templates preserving technical codes untouched
MULTILINGUAL_TEMPLATES = {
    "hi": {
        "greeting": "नमस्ते! मैं NexaStandards (BIS AI Assistant) हूँ।",
        "standard_heading": "अनुशंसित भारतीय मानक (Indian Standards):",
        "evidence_label": "प्रमाणित साक्ष्य (Verified BIS Evidence):",
        "disclaimer": "सूचना: यह जानकारी आधिकारिक BIS दस्तावेजों से सत्यापित है।"
    },
    "kn": {
        "greeting": "ನಮಸ್ಕಾರ! ನಾನು NexaStandards (BIS AI Assistant).",
        "standard_heading": "ಶಿಫಾರಸು ಮಾಡಲಾದ ಭಾರತೀಯ ಮಾನದಂಡಗಳು (Indian Standards):",
        "evidence_label": "ಸತ್ಯಾಪಿತ ಬಿಐಎಸ್ ಸಾಕ್ಷಿ (Verified Evidence):",
        "disclaimer": "ಸೂಚನೆ: ಈ ಮಾಹಿತಿಯು ಅಧಿಕೃತ BIS ಮೂಲಗಳಿಂದ ನೀಡಲಾಗಿದೆ."
    },
    "ta": {
        "greeting": "வணக்கம்! நான் NexaStandards (BIS AI Assistant).",
        "standard_heading": "பரிந்துரைக்கப்பட்ட இந்திய தரநிலைகள் (Indian Standards):",
        "evidence_label": "சரிபார்க்கப்பட்ட ஆதாரம் (Verified Evidence):",
        "disclaimer": "குறிப்பு: இந்த தகவல் BIS அதிகாரப்பூர்வ ஆவணங்களிலிருந்து பெறப்பட்டது."
    },
    "te": {
        "greeting": "నమస్కారం! నేను NexaStandards (BIS AI Assistant).",
        "standard_heading": "సిఫార్సు చేయబడిన భారతీయ ప్రమాణాలు (Indian Standards):",
        "evidence_label": "ధృవీకరించబడిన ఆధారాలు (Verified Evidence):",
        "disclaimer": "గమనిక: ఈ సమాచారం BIS అధికారిక పత్రాల ఆధారంగా ఇవ్వబడింది."
    },
    "bn": {
        "greeting": "নমস্কার! আমি NexaStandards (BIS AI Assistant)।",
        "standard_heading": "সুপারিশকৃত ভারতীয় মানক (Indian Standards):",
        "evidence_label": "যাচাইকৃত সাক্ষ্য (Verified BIS Evidence):",
        "disclaimer": "বিজ্ঞপ্তি: এই তথ্যটি BIS এর অফিশিয়াল নথি থেকে সত্যায়িত।"
    },
    "mr": {
        "greeting": "नमस्कार! मी NexaStandards (BIS AI Assistant) आहे.",
        "standard_heading": "शिफारस केलेले भारतीय मानके (Indian Standards):",
        "evidence_label": "सत्यापित पुरावा (Verified Evidence):",
        "disclaimer": "टीप: ही माहिती BIS अधिकृत दस्तऐवजांवर आधारित आहे."
    },
    "ml": {
        "greeting": "നമസ്കാരം! ഞാൻ NexaStandards (BIS AI Assistant) ആണ്.",
        "standard_heading": "ശിപാർശ ചെയ്ത ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ (Indian Standards):",
        "evidence_label": "സ്ഥിരീകരിച്ച തെളിവുകൾ (Verified Evidence):",
        "disclaimer": "ശ്രദ്ധിക്കുക: ഈ വിവരങ്ങൾ ബിഐഎസ് ഔദ്യോഗിക രേഖകളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്."
    }
}

def process_multilingual_response(answer: str, language: str) -> str:
    """
    Appends language header while guaranteeing standard numbers (IS XXXX)
    and clause numbers remain strictly in original English/Alphanumeric form.
    """
    if language not in MULTILINGUAL_TEMPLATES or language == "en":
        return answer
        
    tpl = MULTILINGUAL_TEMPLATES[language]
    prefix = f"**[{LANGUAGES.get(language, 'Multilingual')} Response]**\n{tpl['greeting']}\n\n"
    return prefix + answer
