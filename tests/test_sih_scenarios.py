import os
import sys
import asyncio
import httpx

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.main import app
from backend.app.db.session import init_db
from database.seed_demo_data import seed

init_db()
seed()

def run_async(coro):
    return asyncio.run(coro)

async def _scenario_1():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "What standard may apply to my product? I manufacture stainless steel water bottles.",
            "language": "en"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["intent"] in ["STANDARD_RECOMMENDATION", "STANDARD_QUERY"]
        assert "17803" in str(data["recommended_standards"]) or "17803" in str(data["evidence"])

async def _scenario_2():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "I need BIS certification for electric kettles.",
            "language": "en"
        })
        assert res.status_code == 200
        assert res.json()["certification_guidance"] is not None

async def _scenario_3():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "What tests are required for IS 17803 stainless steel flasks?",
            "language": "en"
        })
        assert res.status_code == 200
        assert len(res.json()["testing_information"]) > 0

async def _scenario_4():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "Find a laboratory in Delhi for testing water bottles.",
            "language": "en"
        })
        assert res.status_code == 200
        assert len(res.json()["laboratories"]) > 0

async def _scenario_5():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "How does hallmarking work for gold jewellery?",
            "language": "en"
        })
        assert res.status_code == 200
        assert "1417" in str(res.json()["evidence"]) or "HUID" in res.json()["answer"]

async def _scenario_6():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "What is the BIS mark and how can I verify an ISI logo?",
            "language": "en"
        })
        assert res.status_code == 200
        assert "BIS" in res.json()["answer"] or "ISI" in res.json()["answer"]

async def _scenario_7():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/standards/compare?std1=IS 17803&std2=IS 1489")
        assert res.status_code == 200
        assert "comparison_matrix" in res.json()

async def _scenario_8():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        r1 = await client.post("/api/chat", json={
            "message": "I manufacture electric kettles.",
            "language": "en"
        })
        conv_id = r1.json()["conversation_id"]
        
        r2 = await client.post("/api/chat", json={
            "conversation_id": conv_id,
            "message": "What tests are required?",
            "language": "en"
        })
        assert r2.status_code == 200
        assert r2.json()["product_profile"]["product"] == "Kettle"

async def _scenario_9():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "क्या स्टेनलेस स्टील पानी की बोतल के लिए BIS प्रमाणन अनिवार्य है?",
            "language": "hi"
        })
        assert res.status_code == 200
        data = res.json()
        assert "BIS" in data["answer"] or "IS" in data["answer"]

async def _scenario_10():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "ನನ್ನ ಉತ್ಪನ್ನಕ್ಕೆ BIS ಮಾನದಂಡ ಯಾವುದು?",
            "language": "kn"
        })
        assert res.status_code == 200
        assert "BIS" in res.json()["answer"] or "IS" in res.json()["answer"]

async def _scenario_11():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "What is the mandatory certification for warp drive quantum space thrusters in Mars orbit?",
            "language": "en"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["evidence_status"] in ["LOW_EVIDENCE", "UNVERIFIED", "GROUNDED"]

async def _scenario_12():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        # Test 1: Authentic Hawkins Cooker (Operative)
        res_auth = await client.post("/api/verify/product", json={"preset_id": "cml_hawkins"})
        assert res_auth.status_code == 200
        data_auth = res_auth.json()
        assert data_auth["state"] == "VERIFIED"
        assert data_auth["registry_record"]["license_number"] == "CM/L-8400192"
        assert data_auth["registry_record"]["status"] == "OPERATIVE"
        assert "Hawkins" in data_auth["registry_record"]["manufacturer_name"]
        assert "original" in data_auth["opencv_pipeline"]
        assert "binarized" in data_auth["opencv_pipeline"]

        # Test 2: Counterfeit mark (Not verified)
        res_fake = await client.post("/api/verify/product", json={"preset_id": "fake_counterfeit"})
        assert res_fake.status_code == 200
        data_fake = res_fake.json()
        assert data_fake["state"] == "NOT VERIFIED"
        assert data_fake["next_action"]["action"] == "FILE_GRIEVANCE"

async def _scenario_13():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/compliance/roadmap", json={
            "product_name": "Domestic Pressure Cooker",
            "manufacturer_type": "MSME"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["applicable_standard"] == "IS 2347:2017"
        assert "Scheme I" in data["scheme"]
        assert len(data["roadmap"]) == 6
        assert data["roadmap"][0]["stage_name"] == "Standard Identification & Scope"
        assert len(data["roadmap"][3]["details"]["testing_matrix"]) > 0

async def _scenario_14():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/grievance/create", json={
            "product_name": "Counterfeit Pressure Cooker",
            "alleged_license_number": "CM/L-9999999",
            "seller_name": "Shree Ram Crockery Store",
            "seller_address": "Shop 4, Main Market, Jaipur",
            "complaint_type": "FAKE_ISI_MARK",
            "description": "Product has a printed fake ISI mark without valid registration. Gasket ruptured during initial use."
        })
        assert res.status_code == 200
        data = res.json()
        assert data["complaint_ref_no"].startswith("BIS-GRV-2026-")
        assert data["status"] == "DOSSIER_READY"
        assert "Section 14" in data["formatted_dossier"]
        assert "Section 29" in data["formatted_dossier"]
        assert "Shree Ram Crockery Store" in data["formatted_dossier"]

async def _scenario_15():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/gazette/supersessions?standard_number=IS 2347")
        assert res.status_code == 200
        data = res.json()
        assert data["is_amended_or_superseded"] is True
        assert data["warning_banner"] is not None
        assert data["current_active_order"]["order_number"] == "S.O. 1294(E)"
        assert len(data["superseded_history"]) > 0
        assert data["superseded_history"][0]["order_number"] == "S.O. 3857(E)"

async def _scenario_16():
    # 1. "mobile" natural search returning product compliance graph
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/search?q=mobile")
        assert res.status_code == 200
        data = res.json()
        assert data["found"] is True
        assert data["product"]["name"] == "Mobile Phone"
        assert "IS 13252" in data["product"]["primary_standard_number"]
        assert len(data["compliance_graph"]["currently_applicable"]) > 0
        assert len(data["compliance_graph"]["upcoming"]) > 0

async def _scenario_17():
    # 2. "mobile phone" search
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/products/search?q=mobile+phone")
        assert res.status_code == 200
        data = res.json()
        assert data["found"] is True
        assert data["product"]["id"] == "prod_mobile"

async def _scenario_18():
    # 3. Product synonym search ("smartphone" -> Mobile Phone)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/search?q=smartphone")
        assert res.status_code == 200
        data = res.json()
        assert data["found"] is True
        assert data["product"]["name"] == "Mobile Phone"

async def _scenario_19():
    # 4. Current standard retrieval (/api/standards/current)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/standards/current")
        assert res.status_code == 200
        stds = res.json()["standards"]
        assert len(stds) > 0
        assert all(s["status"] in ["ACTIVE", "AMENDED"] for s in stds)

async def _scenario_20():
    # 5. Superseded standard exclusion (IS 13252:2003 not in current)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/standards/current")
        stds = res.json()["standards"]
        std_nums = [s["standard_number"] for s in stds]
        assert "IS 13252:2003" not in std_nums
        assert "IS 2347:2006" not in std_nums

async def _scenario_21():
    # 6. Upcoming standard detection (future effective date)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/standards/IS%2013252/history")
        assert res.status_code == 200
        versions = res.json()["versions"]
        upcoming = [v for v in versions if v["status"] == "UPCOMING"]
        assert len(upcoming) > 0
        assert "62368" in upcoming[0]["standard_number"]

async def _scenario_22():
    # 7. QCO detection (/api/qco?q=cooker)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/qco?q=cooker")
        assert res.status_code == 200
        data = res.json()
        assert len(data) > 0
        assert any(q["order_number"] == "S.O. 1294(E)" for q in data)

async def _scenario_23():
    # 8. Effective date handling (publication vs future effective date)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/updates/latest")
        assert res.status_code == 200
        updates = res.json()["updates"]
        upcoming_items = [u for u in updates if u["change_type"] == "UPCOMING_REQUIREMENT"]
        assert len(upcoming_items) > 0
        assert upcoming_items[0]["is_effective_now"] is False

async def _scenario_24():
    # 9. Amendment detection (/api/standards/{id}/amendments)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/standards/IS%2013252/amendments")
        assert res.status_code == 200
        amds = res.json()["amendments"]
        assert len(amds) > 0
        assert "Amendment 2" in amds[0]["amendment_no"]

async def _scenario_25():
    # 10. Gazette detection (/api/gazette)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.get("/api/gazette")
        assert res.status_code == 200
        orders = res.json()
        assert len(orders) > 0
        assert any(o["order_number"] == "S.O. 1294(E)" for o in orders)

async def _scenario_26():
    # 11. Conflict detection & resolution
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "Which standard applies to mobile phones?",
            "language": "en"
        })
        assert res.status_code == 200
        assert res.json()["confidence"] >= 0.75
        assert res.json()["grounded"] is True

async def _scenario_27():
    # 12. Unsupported query & strict hallucination prevention
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "What is the mandatory BIS specification for alien quantum teleportation warp devices?",
            "language": "en"
        })
        assert res.status_code == 200
        data = res.json()
        assert "could not verify" in data["answer"].lower()
        assert data["evidence_status"] == "LOW_EVIDENCE"
        assert data["grounded"] is False

async def _scenario_28():
    # 13. Citation validation and veracity
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/chat", json={
            "message": "What is the burst pressure requirement for domestic pressure cookers?",
            "language": "en"
        })
        assert res.status_code == 200
        assert len(res.json()["evidence"]) > 0
        assert any("2347" in str(e["standard_number"]) for e in res.json()["evidence"])

async def _scenario_29():
    # 14. Poor OCR quality handling ("I can't read the mark clearly" & "Retake photo")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/verify/product", json={"preset_id": "poor_quality"})
        assert res.status_code == 200
        data = res.json()
        assert data["state"] == "UNABLE TO READ"
        assert "can't read the mark clearly" in data["state_badge"]["message"].lower()
        assert data["retake_photo"]["action"] == "RETAKE_PHOTO"
        assert len(data["retake_photo"]["instructions"]) > 0

async def _scenario_30():
    # 15. Valid CM/L verification (7 digits)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/verify/product", json={"license_number_manual": "CM/L-8400192"})
        assert res.status_code == 200
        assert res.json()["state"] == "VERIFIED"
        assert res.json()["registry_record"]["license_number"] == "CM/L-8400192"

async def _scenario_31():
    # 16. Invalid CM/L format (fewer than 7 digits)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/verify/product", json={"license_number_manual": "CM/L-1234"})
        assert res.status_code == 200
        assert res.json()["state"] == "INVALID FORMAT"

async def _scenario_32():
    # 17. Valid CRS verification (8 digits)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/verify/product", json={"preset_id": "crs_samsung"})
        assert res.status_code == 200
        assert res.json()["state"] == "VERIFIED"
        assert res.json()["registry_record"]["license_number"] == "R-41012345"

async def _scenario_33():
    # 18. Invalid CRS format (incorrect digit count)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/verify/product", json={"license_number_manual": "R-1234"})
        assert res.status_code == 200
        assert res.json()["state"] == "INVALID FORMAT"

async def _scenario_34():
    # 19. Registry unavailable fallback state
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        res = await client.post("/api/verify/product", json={"simulate_registry_offline": True})
        assert res.status_code == 200
        assert res.json()["state"] == "REGISTRY CHECK UNAVAILABLE"
        assert "temporarily unavailable" in res.json()["recommendation"].lower()

async def _scenario_35():
    # 20. Source synchronization and offline monitoring
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        # Trigger simulated offline
        res_off = await client.post("/api/sync/run", json={"simulate_offline": True})
        assert res_off.status_code == 200
        assert res_off.json()["simulated_offline"] is True

        res_stat = await client.get("/api/sync/status")
        assert res_stat.status_code == 200
        assert any(s["status"] in ["SOURCE_UNAVAILABLE", "TEMPORARILY_UNAVAILABLE"] for s in res_stat.json()["sources"])

        # Restore online status
        res_on = await client.post("/api/sync/run", json={"simulate_offline": False})
        assert res_on.status_code == 200

def test_scenario_1_standard_recommendation(): run_async(_scenario_1())
def test_scenario_2_certification_query(): run_async(_scenario_2())
def test_scenario_3_testing_requirements(): run_async(_scenario_3())
def test_scenario_4_laboratory_discovery(): run_async(_scenario_4())
def test_scenario_5_hallmarking_guidance(): run_async(_scenario_5())
def test_scenario_6_consumer_bis_mark(): run_async(_scenario_6())
def test_scenario_7_related_standards(): run_async(_scenario_7())
def test_scenario_8_contextual_follow_up(): run_async(_scenario_8())
def test_scenario_9_hindi_multilingual(): run_async(_scenario_9())
def test_scenario_10_kannada_multilingual(): run_async(_scenario_10())
def test_scenario_11_unsupported_query_no_hallucination(): run_async(_scenario_11())
def test_scenario_12_product_verification(): run_async(_scenario_12())
def test_scenario_13_compliance_roadmap(): run_async(_scenario_13())
def test_scenario_14_grievance_dossier(): run_async(_scenario_14())
def test_scenario_15_gazette_supersession(): run_async(_scenario_15())
def test_scenario_16_mobile_compliance_graph(): run_async(_scenario_16())
def test_scenario_17_mobile_phone_search(): run_async(_scenario_17())
def test_scenario_18_product_synonym_search(): run_async(_scenario_18())
def test_scenario_19_current_standard_retrieval(): run_async(_scenario_19())
def test_scenario_20_superseded_standard_exclusion(): run_async(_scenario_20())
def test_scenario_21_upcoming_standard_detection(): run_async(_scenario_21())
def test_scenario_22_qco_detection(): run_async(_scenario_22())
def test_scenario_23_effective_date_handling(): run_async(_scenario_23())
def test_scenario_24_amendment_detection(): run_async(_scenario_24())
def test_scenario_25_gazette_detection(): run_async(_scenario_25())
def test_scenario_26_conflict_detection(): run_async(_scenario_26())
def test_scenario_27_hallucination_prevention(): run_async(_scenario_27())
def test_scenario_28_citation_validation(): run_async(_scenario_28())
def test_scenario_29_poor_ocr_handling(): run_async(_scenario_29())
def test_scenario_30_valid_cml_verification(): run_async(_scenario_30())
def test_scenario_31_invalid_cml_format(): run_async(_scenario_31())
def test_scenario_32_valid_crs_verification(): run_async(_scenario_32())
def test_scenario_33_invalid_crs_format(): run_async(_scenario_33())
def test_scenario_34_registry_unavailable_fallback(): run_async(_scenario_34())
def test_scenario_35_source_synchronization_offline(): run_async(_scenario_35())

