# NexaStandards — REST API Reference

**Base URL**: `http://127.0.0.1:8000` (or reverse-proxied via `/api/*`)  
**Specification**: OpenAPI 3.0 (Interactive docs at `/docs`)  
**Statutory Policy**: Evidence-Grounded • Source-Locked • Update-Aware  

---

## 1. Core Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Primary AI assistant endpoint returning Level 1/2 guidance, compliance graph, and evidence citations |
| `GET` | `/api/standards/current` | Returns currently operative Indian Standards (excluding superseded or upcoming) |
| `GET` | `/api/standards/{id}/history` | Chronological version tree, supersession pointers, and upcoming transitions |
| `GET` | `/api/standards/{id}/amendments`| Published amendments, effective dates, and clauses modified |
| `GET` | `/api/standards/{id}` | Full standard details, scope, test requirements, and related standards |
| `GET` | `/api/products/{id}/standards` | Product Compliance Graph across 5 statutory categories |
| `GET` | `/api/evidence/{id}` | Statutory provenance, page number, clause number, and source URL |
| `POST` | `/api/verify/product` | 5-state product verification with OpenCV preprocessing and poor OCR guidance |
| `GET` | `/api/updates/latest` | Feed of operative QCOs, recent amendments, and upcoming standard transitions |
| `GET` | `/api/sync/status` | Real-time health, polling intervals, and offline resilience status of BIS pipelines |
| `POST` | `/api/sync/run` | Triggers on-demand source polling with simulated offline support |
| `GET` | `/api/gazette` | Gazette Quality Control Orders (QCOs) with ministry citations |
| `POST` | `/api/compliance/roadmap` | 6-stage MSME conformity pathway generator |
| `POST` | `/api/grievance/create` | Formats formal consumer grievance dossier under BIS Act 2016 Sections 14/15/29 |
| `GET` | `/api/laboratories` | BIS-recognized and NABL-accredited testing facilities by product/standard |

---

## 2. Key Endpoint Details

### 2.1 `/api/chat`
**Request Body**:
```json
{
  "message": "mobile",
  "language": "en",
  "conversation_id": null
}
```

**Response**:
```json
{
  "answer": "Yes — mobile phones are covered under mandatory BIS certification under the Compulsory Registration Scheme (CRS) administered by MeitY...",
  "confidence": 0.95,
  "grounded": true,
  "evidence_status": "GROUNDED",
  "compliance_graph": {
    "currently_applicable": [
      { "standard_number": "IS 13252 (Part 1):2010", "status": "ACTIVE", "is_effective_now": true }
    ],
    "related_supporting": [
      { "standard_number": "IS 16046 (Part 2):2018", "status": "ACTIVE" }
    ],
    "upcoming": [
      { "standard_number": "IS/IEC 62368-1:2023", "status": "UPCOMING", "user_status_label": "Will apply from 2027-01-01" }
    ],
    "historical_superseded": [
      { "standard_number": "IS 13252:2003", "status": "SUPERSEDED" }
    ]
  },
  "level1_consumer_view": {
    "summary": "Yes — this product is covered by a mandatory BIS requirement under Indian law...",
    "what_to_look_for": "Look for the official BIS CRS R-number on the back or in software regulatory labels.",
    "effective_date": "Currently Active"
  },
  "level2_technical_view": {
    "standard_number": "IS 13252 (Part 1):2010",
    "governing_order": "MeitY Compulsory Registration Order",
    "certification_scheme": "Scheme II (CRS Registration)",
    "evidence_citations": [
      { "document": "IS 13252 (Part 1):2010", "clause": "Clause 1.2", "page": 4, "relevance": 0.98 }
    ]
  },
  "actionable_next_steps": [
    { "action": "COMPLIANCE_ROADMAP", "label": "Conformity Pathway for Mobile Phone", "link": "/compliance?product=Mobile+Phone" }
  ]
}
```

---

### 2.2 `/api/verify/product`
**Request Body**:
```json
{
  "preset_id": "poor_quality",
  "license_number_manual": null,
  "simulate_registry_offline": false
}
```

**Response (Poor Quality OCR)**:
```json
{
  "state": "UNABLE TO READ",
  "state_badge": {
    "label": "UNABLE TO READ",
    "message": "I can't read the mark clearly. Please retake the photo."
  },
  "retake_photo": {
    "action": "RETAKE_PHOTO",
    "instructions": [
      "Ensure adequate ambient light without direct glare on the mark.",
      "Hold the camera steady and parallel to the product packaging surface.",
      "Wipe any dust, grease, or condensation from the mark area.",
      "Ensure both the BIS logo (ISI/CRS) and the license number are fully within frame."
    ]
  }
}
```
