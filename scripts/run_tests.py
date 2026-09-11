import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from tests.test_sih_scenarios import (
    test_scenario_1_standard_recommendation,
    test_scenario_2_certification_query,
    test_scenario_3_testing_requirements,
    test_scenario_4_laboratory_discovery,
    test_scenario_5_hallmarking_guidance,
    test_scenario_6_consumer_bis_mark,
    test_scenario_7_related_standards,
    test_scenario_8_contextual_follow_up,
    test_scenario_9_hindi_multilingual,
    test_scenario_10_kannada_multilingual,
    test_scenario_11_unsupported_query_no_hallucination,
    test_scenario_12_product_verification,
    test_scenario_13_compliance_roadmap,
    test_scenario_14_grievance_dossier,
    test_scenario_15_gazette_supersession,
    test_scenario_16_mobile_compliance_graph,
    test_scenario_17_mobile_phone_search,
    test_scenario_18_product_synonym_search,
    test_scenario_19_current_standard_retrieval,
    test_scenario_20_superseded_standard_exclusion,
    test_scenario_21_upcoming_standard_detection,
    test_scenario_22_qco_detection,
    test_scenario_23_effective_date_handling,
    test_scenario_24_amendment_detection,
    test_scenario_25_gazette_detection,
    test_scenario_26_conflict_detection,
    test_scenario_27_hallucination_prevention,
    test_scenario_28_citation_validation,
    test_scenario_29_poor_ocr_handling,
    test_scenario_30_valid_cml_verification,
    test_scenario_31_invalid_cml_format,
    test_scenario_32_valid_crs_verification,
    test_scenario_33_invalid_crs_format,
    test_scenario_34_registry_unavailable_fallback,
    test_scenario_35_source_synchronization_offline
)

def run_all():
    print("=" * 70)
    print("RUNNING NEXASTANDARDS SIH 2026 STATUTORY SUITE (35/35 SCENARIOS)")
    print("=" * 70)
    
    tests = [
        ("Scenario 1: Standard Recommendation", test_scenario_1_standard_recommendation),
        ("Scenario 2: Certification Query", test_scenario_2_certification_query),
        ("Scenario 3: Testing Requirements", test_scenario_3_testing_requirements),
        ("Scenario 4: Laboratory Discovery", test_scenario_4_laboratory_discovery),
        ("Scenario 5: Hallmarking Guidance", test_scenario_5_hallmarking_guidance),
        ("Scenario 6: Consumer Verification", test_scenario_6_consumer_bis_mark),
        ("Scenario 7: Related Standards Comparison", test_scenario_7_related_standards),
        ("Scenario 8: Contextual Follow-up Memory", test_scenario_8_contextual_follow_up),
        ("Scenario 9: Hindi Multilingual Processing", test_scenario_9_hindi_multilingual),
        ("Scenario 10: Kannada Multilingual Processing", test_scenario_10_kannada_multilingual),
        ("Scenario 11: Unsupported Query Grounding Check", test_scenario_11_unsupported_query_no_hallucination),
        ("Scenario 12: Product Verification & BIS Registry Check", test_scenario_12_product_verification),
        ("Scenario 13: 6-Stage Compliance Roadmap Generator", test_scenario_13_compliance_roadmap),
        ("Scenario 14: BIS Act Consumer Grievance Dossier", test_scenario_14_grievance_dossier),
        ("Scenario 15: Gazette & QCO Supersession Alert", test_scenario_15_gazette_supersession),
        ("Scenario 16: Mobile Compliance Graph Categorization", test_scenario_16_mobile_compliance_graph),
        ("Scenario 17: Mobile Phone Natural Language Search", test_scenario_17_mobile_phone_search),
        ("Scenario 18: Product Synonym & Alias Mapping", test_scenario_18_product_synonym_search),
        ("Scenario 19: Current Operative Standard Retrieval", test_scenario_19_current_standard_retrieval),
        ("Scenario 20: Superseded Standard Exclusion from Current", test_scenario_20_superseded_standard_exclusion),
        ("Scenario 21: Upcoming Standard Detection & Transition Alert", test_scenario_21_upcoming_standard_detection),
        ("Scenario 22: QCO Statutory Mandate Detection", test_scenario_22_qco_detection),
        ("Scenario 23: Future Effective Date Status Handling", test_scenario_23_effective_date_handling),
        ("Scenario 24: Amendment Number and Date Extraction", test_scenario_24_amendment_detection),
        ("Scenario 25: Official Gazette Notification Linkage", test_scenario_25_gazette_detection),
        ("Scenario 26: Conflicting Requirements Identification", test_scenario_26_conflict_detection),
        ("Scenario 27: Hallucination Prevention & Exact Statutory Fallback", test_scenario_27_hallucination_prevention),
        ("Scenario 28: Evidence Citation & Provenance Validation", test_scenario_28_citation_validation),
        ("Scenario 29: Poor OCR Unreadable Photo Guidance", test_scenario_29_poor_ocr_handling),
        ("Scenario 30: Valid 7-Digit CM/L Number Verification", test_scenario_30_valid_cml_verification),
        ("Scenario 31: Invalid CM/L Format Handling", test_scenario_31_invalid_cml_format),
        ("Scenario 32: Valid 8-Digit CRS R-Number Verification", test_scenario_32_valid_crs_verification),
        ("Scenario 33: Invalid CRS Format Handling", test_scenario_33_invalid_crs_format),
        ("Scenario 34: Registry Offline Graceful Degradation", test_scenario_34_registry_unavailable_fallback),
        ("Scenario 35: Offline Source Synchronization Handling", test_scenario_35_source_synchronization_offline),
    ]
    
    passed = 0
    failed = []
    for name, test_func in tests:
        try:
            test_func()
            print(f"[PASS] {name}")
            passed += 1
        except Exception as e:
            err_str = str(e).encode('ascii', 'ignore').decode('ascii')
            print(f"[FAIL] {name} - Error: {err_str}")
            failed.append((name, err_str))
            
    print("=" * 70)
    print(f"SUMMARY: {passed}/{len(tests)} Test Scenarios Passed Cleanly!")
    if failed:
        print(f"FAILED ({len(failed)}):")
        for f_name, f_err in failed:
            print(f"  - {f_name}: {f_err}")
    print("=" * 70)
    return passed == len(tests)

if __name__ == "__main__":
    success = run_all()
    if not success:
        sys.exit(1)
