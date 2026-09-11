# NexaStandards — Source Ingestion & Live Data Update Architecture

**SIH 2026 Problem Statement**: SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services  
**Policy**: Evidence-Grounded • Source-Locked • Official Regulatory Metadata Driven  

---

## 1. Core Principles: No PDF Hashing / No Heuristic Diffing

NexaStandards adheres to a strict regulatory compliance rule: **trust official BIS publication and version metadata, never document hashes or visual PDF diffs.**

### Prohibited Approaches
- **NO PDF Hashing**: No SHA-256, MD5, or binary file checksums to detect regulatory changes.
- **NO Visual/Page-Image Diffing**: No comparing rendered PDF pages to guess if a document changed.
- **NO AI Semantic Diffing**: No embedding-distance comparisons between PDF revisions.
- **NO "Magic" Change Detection**: A document file being modified or reformatted does not mean the statutory requirement changed. Regulatory status changes are triggered **only** by recognized official BIS regulatory metadata.

---

## 2. Official Metadata Ingestion & Refresh Flow

The update engine periodically revisits official BIS sources (Manakonline, eGazette, MeitY CRS, BIS CARE registry).

```
         CHECK OFFICIAL SOURCE
                   ↓
         READ OFFICIAL METADATA
                   ↓
    IDENTIFY NEW/REVISED/AMENDED ITEM
                   ↓
             FETCH DOCUMENT
                   ↓
       EXTRACT STRUCTURED CONTENT
                   ↓
            UPDATE DATABASE
                   ↓
          UPDATE RELATIONSHIPS
                   ↓
             RE-INDEX CONTENT
                   ↓
      MARK OLD RECORD APPROPRIATELY
                   ↓
          UPDATE SEARCH RESULTS
```

### Official Metadata Fields Stored per Source/Document
For every BIS regulatory record, the system persists:
- `source_url`: Authoritative government link.
- `document_title`: Full gazetted/published title.
- `document_type`: `INDIAN_STANDARD`, `STANDARD_REVISION`, `AMENDMENT`, `CORRIGENDUM`, `QCO`, `QCO_AMENDMENT`, `GAZETTE_NOTIFICATION`.
- `standard_number`: Official designation (e.g., `IS 13252 (Part 1):2010`).
- `standard_year`: 4-digit edition year as officially published.
- `amendment_number`: Official amendment indicator (e.g., `Amendment 1`).
- `gazette_notification_number`: Official S.O. / G.S.R. gazette citation.
- `publication_date`: Date officially printed/published.
- `effective_date`: Legal enforcement date under statutory orders.
- `withdrawal_date`: Date prior standard ceases to apply.
- `supersedes` / `superseded_by`: Bidirectional regulatory lineage pointers.
- `last_checked`: UTC timestamp of latest source visit.
- `status`: Statutory state (`ACTIVE`, `UPCOMING`, `SUPERSEDED`, `WITHDRAWN`, `UPDATE_REVIEW_REQUIRED`, `SOURCE_UNAVAILABLE`).

---

## 3. Handling Standards & Supersession

Regulatory transitions are governed exclusively by official standard number, year, and revision metadata:

```
Existing:
  IS XXXXX:2020 — Status: ACTIVE

Official BIS source publishes:
  IS XXXXX:2025 — Status: REVISED

Database Transition:
  IS XXXXX:2020 — Status: SUPERSEDED (superseded_by: IS XXXXX:2025)
  IS XXXXX:2025 — Status: ACTIVE     (supersedes: IS XXXXX:2020)
```

---

## 4. Handling Amendments

When BIS publishes an official amendment (e.g., *Amendment No. 1 to IS 2347:2017*):
1. The amendment is stored as a distinct `StandardAmendmentModel` record linked to the parent standard.
2. **The original standard text in the database is NOT modified or overwritten.**
3. Amendments contain their own official publication date, effective date, and clause modifications.

---

## 5. QCO & Gazette Enforcement Dates (Temporal Isolation)

Quality Control Orders and Gazette notifications frequently have future effective dates. The system strictly separates publication from legal enforcement:

| Condition | Statutory Status | User Interface Label | Operative in `/api/standards/current` |
|---|---|---|---|
| `today >= effective_date` | `ACTIVE` / `CURRENT` | `Current (Operative)` | Yes |
| `today < effective_date` | `UPCOMING` | `Upcoming (Applies from [Effective Date])` | No (Excluded from active enforcement) |
| Superseded by newer QCO/revision | `SUPERSEDED` | `Superseded (Replaced by [Newer Order])` | No (Accompanied by supersession notice) |

---

## 6. Resilient Fallbacks (No Silent Hallucinations)

When official sources cannot be cleanly synchronized:

1. **Uninterpretable / Ambiguous Metadata**:
   - If the source is reachable but metadata cannot be definitively parsed into an official regulatory action, the record transitions to:
     **`UPDATE_REVIEW_REQUIRED`**
   - **Crucial Rule**: The system does **NOT** automatically change regulatory status. Human regulatory review is flagged.

2. **Unreachable Source**:
   - If government portals encounter downtime or network errors, the status transitions to:
     **`SOURCE_UNAVAILABLE`**
   - The system serves the last verified snapshot with transparent timestamps and does **NOT** pretend the database is freshly synchronized.

---

## 7. User Interface Transparency

The user interface presents clean, non-technical compliance information:
- **Last checked**: Human-readable date and time (e.g., `2026-09-11 12:30 IST`).
- **Last official update**: Official BIS Gazette / Order information (e.g., `Electronics & IT Goods QCO, 2023 (S.O. 1294(E))`).
- **Effective from**: Official statutory enforcement date (e.g., `01 October 2026`).
- **Current status**: Clear badges (`ACTIVE`, `UPCOMING`, `SUPERSEDED`, `WITHDRAWN`, `UPDATE_REVIEW_REQUIRED`).
- **No technical hash strings, SHA digests, or binary diff metadata are displayed to normal users.**

