# NexaStandards — Testing & Quality Assurance Suite

**SIH 2026 Problem Statement**: SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services  
**Coverage**: 35 Automated Statutory Scenarios + Acceptance Test Runner (Sections 50–53)  

---

## 1. Test Suite Architecture

NexaStandards features two complementary automated test runners:
1. `scripts/run_tests.py`: Complete 35-scenario statutory verification covering every functional requirement of SIH26107.
2. `scripts/run_acceptance_tests.py`: Dedicated acceptance test runner validating Sections 50, 51, 52, and 53.

```
                  Automated Test Execution
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [scripts/run_tests.py]          [scripts/run_acceptance_tests.py]
      (35/35 Scenarios)                (Sections 50-53 Acceptance)
            │                                 │
            ├─ Scenario 1-15: Core Workflows  ├─ Section 50: Mobile Phone 5 Queries
            ├─ Scenario 16-20: Graph & Oper.  ├─ Section 51: Revision V1 -> V2
            ├─ Scenario 21-25: Updates & QCO  ├─ Section 52: Tomorrow Effective Date
            ├─ Scenario 26-28: Gating & Cit.  └─ Section 53: Offline Resilience
            └─ Scenario 29-35: Vision & OCR
```

---

## 2. The 35 Statutory Scenarios Summary

| ID | Name | Core Assertion |
|---|---|---|
| **Scenario 1** | Standard Recommendation | Recommends `IS 17803:2022` for stainless water bottles with Scheme I ISI Mark |
| **Scenario 2** | Certification Query | Affirms mandatory QCO requirement under DPIIT order |
| **Scenario 3** | Testing Requirements | Identifies burst pressure & lead leaching test parameters |
| **Scenario 4** | Laboratory Discovery | Matches BIS-recognized NABL laboratories with ISO/IEC 17025 accreditation |
| **Scenario 5** | Hallmarking Guidance | Explains 6-digit alphanumeric HUID marking under `IS 1417` |
| **Scenario 6** | Consumer Verification | Validates 7-digit CM/L number against active BIS registry |
| **Scenario 7** | Related Standards | Compares portable appliances `IS 302-2-15` vs `IS 2347` |
| **Scenario 8** | Contextual Follow-up | Retains active product context across conversation turns |
| **Scenario 9** | Hindi Multilingual | Processes Devanagari query and preserves canonical Indian Standard numbers |
| **Scenario 10**| Kannada Multilingual | Processes Kannada query and preserves canonical Indian Standard numbers |
| **Scenario 11**| Unsupported Query Grounding | Returns exact statutory fallback string for fictional subject |
| **Scenario 12**| Product Verification | Verifies Hawkins CM/L-8400192 and generates official audit card |
| **Scenario 13**| Compliance Roadmap | Generates complete 6-stage MSME compliance journey |
| **Scenario 14**| Grievance Dossier | Formats statutory complaint under BIS Act 2016 Sections 14, 15, and 29 |
| **Scenario 15**| Gazette Supersession Alert | Detects QCO supersession (S.O. 1294(E) superseding S.O. 3857(E)) |
| **Scenario 16**| Mobile Compliance Graph | Returns 4-category Product Compliance Graph for mobile phones |
| **Scenario 17**| Mobile Phone NL Search | Resolves "mobile" query to `IS 13252 (Part 1):2010` and CRS Scheme II |
| **Scenario 18**| Synonym & Alias Mapping | Maps colloquialisms ("cell phone", "smartphone") to canonical product |
| **Scenario 19**| Current Standard Retrieval | `/api/standards/current` returns operative standards |
| **Scenario 20**| Superseded Standard Exclusion | `/api/standards/current` strictly excludes superseded standards |
| **Scenario 21**| Upcoming Standard Detection | Detects `IS/IEC 62368-1:2023` upcoming transition for `IS 13252` |
| **Scenario 22**| QCO Mandate Detection | Finds DPIIT Order S.O. 1294(E) for cookers |
| **Scenario 23**| Future Effective Date | Distinguishes publication date from future enforcement date |
| **Scenario 24**| Amendment Detection | Extracts Amendment 1 and 2 for `IS 13252` |
| **Scenario 25**| Gazette Linkage | Links operative standards directly to Gazette notifications |
| **Scenario 26**| Conflict Resolution | Resolves multi-standard scopes with high confidence |
| **Scenario 27**| Hallucination Prevention | Intercepts warp drive query and enforces statutory fallback |
| **Scenario 28**| Citation Validation | Verifies authentic clause numbers in evidence payload |
| **Scenario 29**| Poor OCR Handling | Returns `UNABLE TO READ` with "I can't read the mark clearly" & `RETAKE_PHOTO` |
| **Scenario 30**| Valid CM/L Verification | Verifies 7-digit license `CM/L-8400192` |
| **Scenario 31**| Invalid CM/L Format | Rejects malformed license `CM/L-1234` with `INVALID FORMAT` |
| **Scenario 32**| Valid CRS Verification | Verifies 8-digit registration `R-41012345` |
| **Scenario 33**| Invalid CRS Format | Rejects malformed registration `R-1234` with `INVALID FORMAT` |
| **Scenario 34**| Registry Offline Degradation | Returns `REGISTRY CHECK UNAVAILABLE` with official portal link |
| **Scenario 35**| Source Sync Offline Handling | Scheduled poller handles simulated offline network failure gracefully |

---

## 3. How to Run the Tests

### Execute Full 35-Scenario Suite:
```bash
python scripts/run_tests.py
```
**Expected Result**: `SUMMARY: 35/35 Test Scenarios Passed Cleanly!`

### Execute Critical Acceptance Runner (Sections 50–53):
```bash
python scripts/run_acceptance_tests.py
```
**Expected Result**: `ALL ACCEPTANCE TESTS (SECTIONS 50–53) PASSED WITH ZERO ERRORS!`
