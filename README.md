# NexaStandards 🛡️
> **AI-Powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers**  
> **Smart India Hackathon 2026 — Problem Statement ID: SIH26107**  
> *Statutory Policy: Evidence-Grounded • Source-Locked • Update-Aware*  
> *Statutory Framework: Bureau of Indian Standards Act, 2016*

---

[![Tests](https://img.shields.io/badge/SIH%202026%20Statutory%20Suite-35%2F35%20PASSED-brightgreen?style=for-the-badge&logo=pytest)](scripts/run_tests.py)
[![Acceptance Tests](https://img.shields.io/badge/Acceptance%20Tests%20(Sec%2050--53)-PASSED-blue?style=for-the-badge)](scripts/run_acceptance_tests.py)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black?style=for-the-badge&logo=next.js)](frontend/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%26%20Pydantic%20v2-009688?style=for-the-badge&logo=fastapi)](backend/)
[![OpenCV](https://img.shields.io/badge/Vision-OpenCV%20Preprocessing-red?style=for-the-badge&logo=opencv)](backend/app/api/verify.py)
[![Policy](https://img.shields.io/badge/Policy-Evidence--Grounded%20%E2%80%A2%20Source--Locked%20%E2%80%A2%20Update--Aware-emerald?style=for-the-badge)](backend/app/core/validator.py)

---

## 📌 Executive Summary

**NexaStandards** is an authoritative, evidence-grounded AI decision-support platform designed to transform how Indian industries, MSMEs, startups, consumers, and testing laboratories navigate Bureau of Indian Standards (BIS) regulations.

Traditional regulatory discovery is manual, fragmented across dozens of PDF gazettes, and vulnerable to counterfeit products. NexaStandards resolves this through **Four Core Pillars**, combining multimodal conversational AI, layout-aware standard parsing (Docling), computer-vision packaging verification (OpenCV), and automated statutory enforcement dossiers.

### Core Guarantees:
1. **Zero Extrapolation / Strict Grounding**: Every regulatory answer is locked to official Gazette notifications, Quality Control Orders (QCOs), and Indian Standards.
2. **Deterministic Statutory Fallback**: Unsupported or unverified queries trigger the exact official statutory disclaimer:
   > *"I could not verify this information from the available official BIS sources. I don't want to provide potentially incorrect regulatory information. Please provide more details or check the official BIS source."*
3. **Temporal Isolation**: Strictly distinguishes **Publication Date** (Gazette notification) from **Effective Date** (Statutory market enforcement). Standards scheduled for future transition (e.g., `IS/IEC 62368-1:2023`) are cleanly flagged as `UPCOMING` and excluded from currently operative standards.
4. **5-Category Product Compliance Graph**: Natural product queries (e.g., *"mobile"*, *"cooker"*, *"bottle"*) generate structured compliance graphs categorizing operative, supporting, referenced, upcoming, and historical/superseded standards.
5. **Two-Level Answer Architecture**: Provides Level 1 (plain language for consumers) and Level 2 (clauses, testing matrices, and legal orders for professionals) with a seamless UI toggle.

---

## 🏛️ The Four Core Pillars of NexaStandards

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         NexaStandards                                                │
│                                           (SIH26107)                                                 │
└──────────────┬───────────────────────────┬───────────────────────────┬───────────────────────────────┘
               │                           │                           │
               ▼                           ▼                           ▼
 ┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
 │ 1. ASK IN ONE PLACE       │ │ 2. UNDERSTAND BIS DOCS    │ │ 3. VERIFY PRODUCTS FAST   │ │ 4. TAKE THE NEXT ACTION   │
 ├───────────────────────────┤ ├───────────────────────────┤ ├───────────────────────────┤ ├───────────────────────────┤
 │ • Multimodal (Text/Voice/ │ │ • Layout-aware Docling    │ │ • OpenCV 4-Stage Image    │ │ • 6-Stage Conformity      │
 │   Packaging Photo)        │   parser (IS standards)     │   Filter Pipeline           │   Roadmap Generator       │
 │ • 8 Indian Languages      │ │ • Clause & Table Extractor│ │ • 7-Digit CM/L & 8-Digit  │ • Scheme I vs Scheme II   │
 │ • Strict Grounding Gating │ │ • Gazette & QCO           │   CRS Regex Matcher         │ • NABL Laboratory Matcher │
 │   (Confidence >= 0.75)    │   Supersession Engine       │ │ • BIS CARE Cross-Check    │ • BIS Act 2016 Statutory  │
 │ • Canonical Citation Guard│ │ • Active vs Deprecated    │   (5 Statutory States)      │   Grievance Dossier (PDF) │
 └───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘
```

---

## 🧩 Comprehensive Documentation Index

All architecture, data modeling, algorithm, and API specifications are detailed in the [`docs/`](docs/) directory:

- [System Architecture & 4 Pillars](docs/architecture.md)
- [Relational Data Model & Schemas](docs/data-model.md)
- [Source Ingestion & Update Monitoring Pipeline](docs/source-ingestion.md)
- [Regulatory Validation & Grounding Gating](docs/regulatory-validation.md)
- [Docling Hybrid Retrieval & Boosting](docs/retrieval.md)
- [Comprehensive REST API Reference](docs/api.md)
- [Testing & Quality Assurance Suite](docs/testing.md)
- [Production Deployment Runbook](docs/deployment.md)

---

## 🎯 SIH26107 Requirement Mapping

| SIH26107 Requirement | NexaStandards Implementation | Verification & Testing |
| :--- | :--- | :--- |
| **Multimodal Querying** | Text, Speech-to-Text (Web Speech API), and Packaging Photo Upload | `/assistant`, `/api/chat` |
| **Indian Standards Understanding** | Authentic standards (`IS 13252`, `IS 16046`, `IS 16333`, `IS/IEC 62368-1`, `IS 2347`, `IS 17803`, `IS 302-2-15`, `IS 1417`, `IS 9873`, `IS 4151`) | `/standards`, Scenario 1-5 |
| **QCO / Gazette Supersession** | Chronological supersession tracking (`S.O. 1294(E)` superseding `S.O. 3857(E)`) | `/standards`, Scenario 15, 22, 25 |
| **Product Compliance Graph** | 5 statutory categories: Currently Applicable, Related/Supporting, Referenced, Upcoming, Historical/Superseded | `/api/chat`, Scenario 16 |
| **Two-Level Answer Delivery** | Level 1 (consumer plain-language summary) vs Level 2 (technical clauses & evidence citations) | `/assistant`, `/api/chat` |
| **Product Verification (ISI / CRS)**| OpenCV 4-stage pipeline + 7-digit CM/L & 8-digit CRS regex + BIS registry cross-check | `/verify`, `/api/verify/product` |
| **5 Statutory Verification States** | `VERIFIED`, `NOT VERIFIED`, `INVALID FORMAT`, `UNABLE TO READ`, `REGISTRY CHECK UNAVAILABLE` | Scenario 29-34, `/verify` |
| **Poor OCR Photography Guidance** | "I can't read the mark clearly" + `RETAKE_PHOTO` action + 4 clear photographic instructions | Scenario 29, `/verify` |
| **Conformity Assessment Guidance** | Automated 6-stage compliance roadmap with testing matrix and fee estimation | `/compliance`, Scenario 13 |
| **Lab Discovery** | NABL-accredited laboratory search with contact details and standard scope | `/laboratories`, Scenario 4 |
| **Consumer Grievance Redressal** | Formal complaint generator citing BIS Act 2016 Sections 14, 15 & 29 | `/grievance`, Scenario 14 |
| **Multilingual Support** | 8 Indian languages with canonical number preservation (`IS 2347:2017`) | Scenarios 9 & 10 |
| **Evidence-Grounded Policy** | Strict confidence gate (≥ 0.75) + exact statutory fallback for ungrounded queries | Scenario 11, 27 |
| **Live Source Synchronization** | Scheduled polling (60m), SHA-256 hashes, offline resilience, and cached snapshot fallback | Scenario 35, Section 53 |

---

## ⚡ Quickstart Guide

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/your-org/nexa-standards.git
cd nexa-standards

# Python Virtual Environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Seed Database with Authentic BIS Data
```bash
python database/seed_demo_data.py
```

### 3. Run Automated Validation Suites
Verify that all 35 scenarios and acceptance tests pass:
```bash
# Run 35-Scenario Test Suite
python scripts/run_tests.py

# Run Sections 50-53 Acceptance Tests
python scripts/run_acceptance_tests.py
```

### 4. Launch Backend API
```bash
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger documentation: `http://127.0.0.1:8000/docs`

### 5. Launch Next.js 14 Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Platform UI live at: `http://localhost:3000`

---

## 🧪 Verification Commands

| Command | Purpose | Expected Result |
|---|---|---|
| `python scripts/run_tests.py` | Runs all 35 SIH 2026 scenarios | `SUMMARY: 35/35 Test Scenarios Passed Cleanly!` |
| `python scripts/run_acceptance_tests.py` | Validates Sections 50, 51, 52, and 53 | `ALL ACCEPTANCE TESTS (SECTIONS 50–53) PASSED WITH ZERO ERRORS!` |
| `cd frontend && npm run build` | Validates Next.js production bundle & static generation | `✓ Generating static pages (24/24)` with code 0 |

---

## ⚖️ Statutory Governance & Legal Disclaimer

NexaStandards references statutory publications of the Bureau of Indian Standards and the Gazette of India under the authority of the **Bureau of Indian Standards Act, 2016**. While designed to achieve maximum fidelity with official standards, commercial certification applications and factory audit filings must be finalized via the official [BIS Manakonline Portal](https://www.manakonline.in).
