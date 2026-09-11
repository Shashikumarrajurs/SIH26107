# NexaStandards — Architecture & System Design

**SIH 2026 Problem Statement**: SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers  
**Statutory Policy**: Evidence-Grounded • Source-Locked • Update-Aware  
**Statutory Framework**: Bureau of Indian Standards Act, 2016  

---

## 1. Executive Summary

NexaStandards is a high-assurance, source-locked, update-aware AI intelligence system built for the Bureau of Indian Standards (BIS) ecosystem. The platform ingests official BIS Gazette notifications, Quality Control Orders (QCOs), and Indian Standards (IS), maintaining an immutable chronological version graph that connects products to operative standards, test requirements, accredited laboratories, and enforcement rules.

Unlike generic LLM chatbots that extrapolate or generate unverified regulatory text, NexaStandards implements **Confidence-Gated Regulatory Validation** and **Zero-Hallucination Fallback**: any query that lacks verified grounding from official BIS repositories is intercepted and returned with the exact statutory fallback:

> *"I could not verify this information from the available official BIS sources. I don't want to provide potentially incorrect regulatory information. Please provide more details or check the official BIS source."*

---

## 2. The 4 Statutory Pillars

The system architecture directly mirrors the 4 foundational pillars required by Problem Statement SIH26107:

```
+--------------------------------------------------------------------------------------------------+
|                                    NEXASTANDARDS PLATFORM                                        |
+---------------------------------+--------------------------------+-------------------------------+
|  PILLAR 1: ASK IN ONE PLACE     |  PILLAR 2: UNDERSTAND BIS DOCS |  PILLAR 3: VERIFY PRODUCTS    |
|  - Multimodal AI Orchestrator   |  - Docling Layout-Aware Chunk  |  - OpenCV Adaptive Threshold  |
|  - Entity Extraction & Aliases  |  - Clause-Level Ingestion      |  - 7-Digit CM/L Regex Engine  |
|  - 16 Statutory Intent Classes  |  - QCO & Gazette Hierarchy     |  - 8-Digit CRS R-No Engine    |
|  - 8 Indian Languages + English |  - Standard Version History    |  - 5 Statutory Verify States  |
+---------------------------------+--------------------------------+-------------------------------+
|                                 PILLAR 4: TAKE THE NEXT ACTION                                   |
|  - 6-Stage MSME Compliance Roadmap (Scheme I ISI Mark vs Scheme II CRS Registration)             |
|  - NABL-Accredited BIS Recognized Laboratory Discovery & Scope Matching                         |
|  - Formal Consumer Grievance Dossier Generation under Sections 14, 15, and 29 of BIS Act 2016    |
+--------------------------------------------------------------------------------------------------+
```

---

## 3. High-Level System Architecture Diagram

```mermaid
graph TD
    User([Consumer / MSME / Laboratory / Officer]) -->|Query / Photo / Voice| Frontend[Next.js 14 App Router UI]
    Frontend -->|Reverse Proxy /api/*| Gateway[FastAPI Statutory Backend Gateway]
    
    subgraph Core Processing Pipeline
        Gateway --> IntentEngine[Intent Classifier (16 Classes)]
        Gateway --> EntityEngine[Product Entity & Canonical Synonym Mapper]
        Gateway --> VisionEngine[OpenCV & OCR Product Verification Service]
        
        IntentEngine --> Orchestrator[Query Orchestrator]
        EntityEngine --> Orchestrator
        
        Orchestrator --> Retriever[Docling Hybrid Retrieval Engine]
        Retriever -->|BM25 Keyword Matching| BM25Index[(BM25 In-Memory Index)]
        Retriever -->|Dense Vector Search| VectorStore[(Vector Embeddings)]
        Retriever -->|Product Context Boost +0.45| SQLDB[(Authoritative SQLite/PostgreSQL Database)]
        
        Retriever --> Validator[Strict Grounding & Regulatory Validator]
        Validator -->|Confidence >= 0.75 & Grounded| Synthesizer[Two-Level Answer Generator]
        Validator -->|Confidence < 0.75 or Fictional| FallbackEngine[Statutory Fallback Interceptor]
        
        Synthesizer -->|Level 1: Consumer Plain Language| ResponseFormatter[Response Assembler]
        Synthesizer -->|Level 2: Technical Clauses & Citations| ResponseFormatter
        FallbackEngine --> ResponseFormatter
    end
    
    subgraph Live Synchronization Engine
        SyncMonitor[Scheduled Polling Service (60 min)] --> GazetteScraper[Official Gazette Crawler]
        SyncMonitor --> QCOScraper[DPIIT / Ministry QCO Monitor]
        SyncMonitor --> BISCareScraper[Authoritative Registry Sync]
        
        GazetteScraper --> UpdateEngine[BIS Update Engine]
        QCOScraper --> UpdateEngine
        BISCareScraper --> UpdateEngine
        
        UpdateEngine -->|Official Metadata Verification| VersionManager[Standard Version & Supersession Manager]
        VersionManager -->|Mark V1 SUPERSEDED, V2 ACTIVE| SQLDB
        VersionManager -->|Log Audit Event| AuditTrail[(Immutable Audit Log)]
    end
    
    ResponseFormatter -->|Grounded JSON Payload| Frontend
```

---

## 4. Docling Layout-Aware RAG Pipeline

Standard regulatory documents published by the Bureau of Indian Standards and Central Ministries contain complex structural layouts: multi-column provisions, testing parameter tables, amendment marginalia, and legal enactment clauses. Generic naive chunking splits clauses arbitrarily, severing test thresholds from their parent specification.

### Chunking Specification
- **Parser**: Layout-aware table and heading parser extracting bounding boxes, section hierarchies, and clause IDs.
- **Chunk Identity**: Every chunk carries immutable statutory provenance:
  - `standard_number` (e.g., `IS 13252 (Part 1):2010`)
  - `clause` (e.g., `Clause 1.2`, `Clause 8.1`)
  - `page_number` (e.g., `Page 4`)
  - `document_title`
  - `source_authority` (e.g., `Bureau of Indian Standards`, `MeitY`, `DPIIT`)
- **Product Context Boosting**: During retrieval, if the recognized product matches the standard's scope, a boost of **+0.45** is added to the chunk's score, ensuring operative requirements are never submerged by generic secondary references.

---

## 5. Confidence-Gated Regulatory Validation

Regulatory assertions must be verified prior to synthesis. The validation gate executes four sequential checks:

1. **Substantive Token Overlap**:
   Generic stopwords (`mandatory`, `specification`, `standards`, `under`, `requirements`) are stripped. Substantive technical tokens (e.g., `burst pressure`, `lithium battery`, `huid`) must achieve at least 25% overlap with authoritative clause text.
2. **Product Profile Presence**:
   The query subject must resolve to a known canonical product code or verified standard.
3. **Supersession & Effective Date Check**:
   If a standard is tagged `SUPERSEDED`, an operative warning is generated. If an amendment or standard has `effective_date > today`, its status is flagged as `UPCOMING` (`is_effective_now = False`).
4. **Confidence Threshold**:
   Overall grounding confidence must exceed **0.75**. If it falls below this statutory threshold, the orchestrator immediately returns the standard fallback message without synthesizing ungrounded text.

---

## 6. Two-Level Response Structure

Every successful query generates a dual-perspective output:

### Level 1: Consumer Plain-Language Guidance
- **Plain Language Summary**: Direct yes/no answer regarding BIS mandatoriness, simple explanation of operative standard and certification mark.
- **What to Look For**: Practical guide for packaging inspection (e.g., *"Look for the 7-digit CM/L number below the ISI mark on the base of the cooker"*).
- **Operative Status**: Clear statement of whether requirements are in force today.

### Level 2: Technical Regulatory Evidence
- **Operative Standard Number & Title**: Complete official standard designation.
- **Governing Legal Order**: Quality Control Order number, Ministry name, and Gazette notification citation.
- **Testing Matrix**: Mandated testing parameters, safety thresholds, and destructive/non-destructive tests.
- **Recognized Testing Facilities**: BIS-recognized NABL accredited laboratories equipped for the standard.
- **Evidence Citations**: Exact clauses, page numbers, and repository URLs for compliance audits.
