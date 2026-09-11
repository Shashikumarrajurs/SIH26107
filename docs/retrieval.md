# NexaStandards — Hybrid Retrieval & Docling Pipeline

**SIH 2026 Problem Statement**: SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services  
**Retrieval Engine**: BM25 Lexical + Dense Semantic Embedding + Product-Context Boosting  

---

## 1. Overview

Regulatory retrieval requires a balance between:
1. **Exact Lexical Precision**: Finding specific standard numbers (`IS 13252`), clause numbers (`Clause 4.1`), test metrics (`0.01% by mass`), and Gazette order codes (`S.O. 1294(E)`).
2. **Semantic Generalization**: Mapping informal consumer queries (*"my phone gets hot while charging"*, *"safe cooking pots for induction"*) to formal technical provisions.

NexaStandards achieves this via **Hybrid Retrieval with Product Context Boosting**.

---

## 2. Hybrid Retrieval Pipeline

```
                              User Query
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
      BM25 Lexical Search                     Dense Embedding Search
    (Exact terms & numbers)                  (Conceptual similarity)
              │                                         │
              └────────────────────┬────────────────────┘
                                   │
                                   ▼
                       Reciprocal Rank Fusion
                                   │
                                   ▼
                    Product Context Re-Ranking
             (Matches recognized product? +0.45 boost)
                                   │
                                   ▼
                    Top-K Evidence Clause Chunks
                 (Clause, Page, Title, Relevance)
```

---

## 3. Product Context Boosting (+0.45)

When a user submits a broad query such as *"mobile"* or *"cooker"*, generic embedding algorithms often retrieve general quality principles or unrelated electrical apparatus clauses before the core product specification.

To prevent this:
1. The `EntityExtractor` identifies the canonical product.
2. The `HybridRetriever` inspects the candidate chunks.
3. If a chunk originates from a standard registered as the primary or supporting specification for that product, its hybrid score receives an additive boost of **+0.45**.
4. This ensures that:
   - For *"mobile"*, `IS 13252 (Part 1):2010` and `IS 16046 (Part 2):2018` are ranked at the very top.
   - For *"pressure cooker"*, `IS 2347:2017` and `S.O. 1294(E)` are ranked at the very top.
   - For *"water bottle"*, `IS 17803:2022` is ranked at the very top.

---

## 4. Clause Chunk Metadata Schema

Every indexed chunk stores rich provenance attributes:
```json
{
  "id": "chk_13252_1",
  "document_id": "doc_13252",
  "document_title": "IS 13252 (Part 1):2010 IT Equipment Safety Specification",
  "standard_number": "IS 13252 (Part 1):2010",
  "clause": "Clause 1.2 & MeitY Order",
  "page": 4,
  "text": "Compulsory Registration Scheme (CRS): Equipment must be tested for electrical safety, electric shock protection, insulation resistance, and dielectric strength under MeitY Gazette notification.",
  "source": "DEMO DATA - SIH PROTOTYPE (BIS Official Repository)",
  "relevance_score": 0.98
}
```
