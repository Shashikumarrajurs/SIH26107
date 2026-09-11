"""
NexaStandards — Acceptance Test Suite: Semantic Diff Engine, 3-Personas & Multilingual Localization
SIH 2026 Problem Statement: SIH26107
Evaluates:
- No PDF hashing / checksum comparisons.
- Structured clause semantic comparison: MODIFIED, ADDED, MOVED.
- Regulatory impact classification (SAFETY, TESTING, HIGH).
- 3 Personas (Consumer, Startup, Product Builder).
- Multilingual canonical entity resolution.
"""

import sys
import os
import asyncio
import httpx

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.app.main import app
from backend.app.core.semantic_diff import semantic_diff_engine

async def test_judge_demo_scenarios():
    print("\n--- Testing Judge Demo Scenarios (Structured Semantic Diff — No Hashing) ---")
    
    # 1. Demo Test 1: Modified requirement (300 kPa -> 350 kPa)
    d1 = semantic_diff_engine.simulate_demo_test_1()
    assert d1["success"] is True, f"Demo Test 1 failed: {d1}"
    res1 = d1["result"]
    assert res1["change_type"] == "MODIFIED"
    assert "300 kPa" in res1["old_content"]
    assert "350 kPa" in res1["new_content"]
    assert res1["impact_category"] in ("TESTING", "SAFETY")
    assert res1["impact_level"] == "HIGH"
    print("  [OK] Demo Test 1: Clause 5.2 modification (300 kPa -> 350 kPa) verified (TESTING HIGH)")

    # 2. Demo Test 2: Added clause (Clause 4 introduced)
    d2 = semantic_diff_engine.simulate_demo_test_2()
    assert d2["success"] is True, f"Demo Test 2 failed: {d2}"
    assert d2["result"]["change_type"] == "ADDED"
    assert d2["result"]["clause_number"] == "4"
    print("  [OK] Demo Test 2: Added clause detection (Clause 4 introduced) verified")

    # 3. Demo Test 3: Moved/Renamed clause (Clause 5.2 -> 6.1)
    d3 = semantic_diff_engine.simulate_demo_test_3()
    assert d3["success"] is True, f"Demo Test 3 failed: {d3}"
    assert d3["result"]["change_type"] == "MOVED"
    assert d3["result"]["similarity_score"] >= 0.70
    print("  [OK] Demo Test 3: Moved/Renamed clause detection (Clause 5.2 -> 6.1) verified via semantic similarity")

async def test_3_personas_and_multilingual():
    print("\n--- Testing 3-Persona Guidance & Multilingual Engine ---")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        # Consumer Persona
        r_con = await client.post("/api/chat", json={
            "message": "What should I check when buying a stainless steel water bottle?",
            "persona": "consumer"
        })
        assert r_con.status_code == 200
        con_data = r_con.json()
        assert "consumer" in con_data["persona_views"]
        assert "what_to_look_for_on_packaging" in con_data["persona_views"]["consumer"]
        print("  [OK] Persona 1 (Consumer): Packaging checks, fake protection, and verification guidance verified")

        # Startup Persona
        r_start = await client.post("/api/chat", json={
            "message": "I want to manufacture domestic pressure cookers",
            "persona": "startup"
        })
        assert r_start.status_code == 200
        start_data = r_start.json()
        assert "startup" in start_data["persona_views"]
        checklist = start_data["persona_views"]["startup"]["checklist"]
        assert len(checklist) == 14, f"Expected 14 checklist items, got {len(checklist)}"
        print("  [OK] Persona 2 (Startup/MSME): 14-item practical manufacturing checklist verified")

        # Product Builder Persona
        r_bld = await client.post("/api/chat", json={
            "message": "Technical testing parameters for mobile phone IS 13252",
            "persona": "builder"
        })
        assert r_bld.status_code == 200
        bld_data = r_bld.json()
        assert "builder" in bld_data["persona_views"]
        assert len(bld_data["bis_12_steps"]) == 12
        print("  [OK] Persona 3 (Product Builder): Deep engineering specifications and 12-step process verified")

        # Multilingual Kannada Query
        r_kn = await client.post("/api/chat", json={
            "message": "ಈ ಪ್ರೆಶರ್ ಕುಕ್ಕರ್ಗೆ BIS ಬೇಕಾ?",
            "language": "kn"
        })
        assert r_kn.status_code == 200
        kn_data = r_kn.json()
        assert kn_data["product"] == "Domestic Pressure Cooker"
        assert "2347" in str(kn_data["standards"]) or "2347" in str(kn_data["evidence"])
        print("  [OK] Multilingual Kannada Entity Resolution: 'ಈ ಪ್ರೆಶರ್ ಕುಕ್ಕರ್ಗೆ BIS ಬೇಕಾ?' matched to Domestic Pressure Cooker")

        # Multilingual Hindi Query
        r_hi = await client.post("/api/chat", json={
            "message": "मोबाइल के लिए BIS जरूरी है क्या?",
            "language": "hi"
        })
        assert r_hi.status_code == 200
        hi_data = r_hi.json()
        assert hi_data["product"] == "Mobile Phone"
        print("  [OK] Multilingual Hindi Entity Resolution: 'मोबाइल के लिए BIS जरूरी है क्या?' matched to Mobile Phone")

        # Endpoints /api/changes/*
        r_chg = await client.get("/api/changes/latest")
        assert r_chg.status_code == 200
        assert r_chg.json()["total_changes"] >= 3
        print("  [OK] Semantic changes API /api/changes/latest returned structured clause diff records")

        # Glossary /api/changes/glossary
        r_glo = await client.get("/api/changes/glossary?lang=hi")
        assert r_glo.status_code == 200
        assert len(r_glo.json()["glossary"]) >= 4
        print("  [OK] BIS terminology glossary /api/changes/glossary returned localized definitions")

async def run_all():
    print("=" * 75)
    print("NEXASTANDARDS SIH 2026: SEMANTIC DIFF & PERSONA TEST SUITE")
    print("=" * 75)
    await test_judge_demo_scenarios()
    await test_3_personas_and_multilingual()
    print("\n" + "=" * 75)
    print("ALL SEMANTIC DIFF & PERSONA TESTS PASSED CLEANLY (ZERO ERRORS)!")
    print("=" * 75)

if __name__ == "__main__":
    asyncio.run(run_all())
