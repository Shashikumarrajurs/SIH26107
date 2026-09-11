# NexaStandards — Regulatory Validation & Hallucination Prevention

**SIH 2026 Problem Statement**: SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services  
**Threshold**: Minimum Confidence ≥ 0.75  
**Policy**: Evidence-Grounded • Source-Locked • Update-Aware  

---

## 1. Zero-Hallucination Regulatory Principle

In Indian statutory compliance, recommending an incorrect Indian Standard or hallucinating a compliance parameter carries severe real-world consequences:
- Rejection of factory license applications on the Manakonline portal.
- Seizure of goods at Indian customs under Section 29 of the BIS Act, 2016.
- Costly redesign of manufacturing tooling for non-mandated specifications.

To eliminate this risk, NexaStandards implements **multi-stage deterministic validation** before any LLM answer synthesis is delivered to the user.

---

## 2. Validation Architecture

```mermaid
graph TD
    Query[User Query] --> SubstantiveExtractor[Extract Substantive Domain Tokens]
    SubstantiveExtractor --> StopwordFilter[Filter Regulatory & Generic Stopwords]
    StopwordFilter --> OverlapEvaluator[Evaluate Substantive Overlap with Retrieved Chunks]
    
    RetrievedChunks[Retrieved Clause Chunks] --> ScoreEvaluator[Inspect Max Hybrid Score]
    RetrievedChunks --> SupersessionEvaluator[Check Status: SUPERSEDED / WITHDRAWN]
    RetrievedChunks --> EffectiveDateEvaluator[Check Future Effective Date]
    
    OverlapEvaluator --> GroundingGate{Grounding Criteria Met?}
    ScoreEvaluator --> GroundingGate
    
    GroundingGate -->|Yes: Recognized Product OR (Overlap >= 25% AND Score >= 0.15)| ComputeHighConfidence[Assign Confidence: 0.78 - 0.98]
    GroundingGate -->|No: Unsupported Subject / Speculative Query| ComputeLowConfidence[Assign Confidence: 0.10 - 0.40]
    
    ComputeHighConfidence --> ThresholdCheck{Confidence >= 0.75?}
    ComputeLowConfidence --> ThresholdCheck
    
    ThresholdCheck -->|Pass| SynthesizeTwoLevel[Synthesize Level 1 & Level 2 Answers]
    ThresholdCheck -->|Fail| InterceptFallback[Return Exact Statutory Fallback]
```

---

## 3. Statutory Fallback Message

Whenever a query fails grounding, the system must NEVER guess or speculate. It intercepts the response and returns the exact approved statutory fallback string:

```text
I could not verify this information from the available official BIS sources. I don't want to provide potentially incorrect regulatory information. Please provide more details or check the official BIS source.
```

The accompanying JSON payload guarantees:
- `confidence`: `< 0.75` (typically `0.10` - `0.25`)
- `evidence_status`: `"LOW_EVIDENCE"`
- `grounded`: `false`
- `standards`: `[]`
- `regulatory_status`: `"UNVERIFIED"`

---

## 4. Conflict & Supersession Detection

When multiple standards appear in the retrieved set for a single product query, the validator checks their inter-relationship:
1. **Valid Evolution**: If Standard A supersedes Standard B, the newer revision is marked as operative, and Standard B is relegated to Historical/Superseded with an explanatory note.
2. **Complementary Coverage**: If one standard covers electrical safety (e.g., `IS 13252`) and another covers the embedded lithium battery (e.g., `IS 16046`), the validator places them into distinct categories (`Currently Applicable` vs `Related / Supporting`).
3. **Genuine Ambiguity**: If two conflicting active standards cover the same scope without an explicit supersession link, the system raises an explicit alert:
   > *"Multiple standards retrieved. Verify specific product scope before commencing testing."*
