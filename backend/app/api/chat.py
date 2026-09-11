import uuid
import json
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.db.models import ConversationModel, ProductProfileModel, MessageModel, CitationModel
from backend.app.core.orchestrator import query_orchestrator
from backend.app.core.journey import build_bis_journey

router = APIRouter(prefix="/chat", tags=["Main Chat Assistant"])

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str
    language: Optional[str] = "en"
    persona: Optional[str] = "consumer" # "consumer" | "startup" | "builder"
    image_base64: Optional[str] = None
    user_context: Optional[Dict[str, Any]] = None

@router.post("", response_model=Dict[str, Any])
def post_chat_message(req: ChatRequest, db: Session = Depends(get_db)):
    message_text = req.message.strip()
    if not message_text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    # 1. Manage Conversation Context
    conv_id = req.conversation_id
    if not conv_id:
        conv_id = str(uuid.uuid4())
        conv = ConversationModel(id=conv_id, title=message_text[:40], language=req.language)
        db.add(conv)
        db.commit()
    else:
        conv = db.query(ConversationModel).filter(ConversationModel.id == conv_id).first()
        if not conv:
            conv = ConversationModel(id=conv_id, title=message_text[:40], language=req.language)
            db.add(conv)
            db.commit()

    # Save incoming user message
    user_msg = MessageModel(
        id=str(uuid.uuid4()),
        conversation_id=conv_id,
        sender="user",
        content=message_text
    )
    db.add(user_msg)
    
    # 2. Existing Product Profile Context
    prof_model = db.query(ProductProfileModel).filter(ProductProfileModel.conversation_id == conv_id).first()
    existing_profile = {}
    if prof_model:
        existing_profile = {
            "product": prof_model.product,
            "material": prof_model.material,
            "intended_use": prof_model.intended_use,
            "target_user": prof_model.target_user,
            "industry": prof_model.industry,
            "market": prof_model.market,
            "location": prof_model.location
        }

    # 3. Execute Central Query Orchestration
    orch_result = query_orchestrator.process_query(
        db=db,
        query=message_text,
        language=req.language or "en",
        persona=req.persona or "consumer",
        conversation_id=conv_id,
        existing_profile=existing_profile
    )

    # 4. Update Product Profile Persistence
    updated_profile = orch_result.get("product_profile", {})
    if prof_model:
        for key, val in updated_profile.items():
            if val:
                setattr(prof_model, key, val)
    else:
        prof_model = ProductProfileModel(
            id=str(uuid.uuid4()),
            conversation_id=conv_id,
            **{k: v for k, v in updated_profile.items() if hasattr(ProductProfileModel, k)}
        )
        db.add(prof_model)
    db.commit()

    # 5. Extract structured components for backward-compatibility with SIH test scenarios
    recommended_stds = orch_result.get("standards", [])
    retrieved_evidence = orch_result.get("evidence", [])
    tech_view = orch_result.get("level2_technical_view", {})
    
    testing_info = tech_view.get("mandatory_testing_matrix", [])
    if not testing_info and orch_result.get("intent") == "TESTING":
        testing_info = [
            {"test_name": "Quality & Safety Verification", "clause": "Clause 4.1", "parameter": "Material and safety specification"}
        ]

    labs_info = tech_view.get("laboratories", [
        {
            "name": "Central Laboratory Bureau of Indian Standards - Sahibabad",
            "city": "Ghaziabad / Delhi NCR",
            "lab_code": "BIS-LAB-DEL-01",
            "accreditation": "NABL ISO/IEC 17025 Accredited"
        }
    ])
    
    cert_guidance = {
        "scheme": tech_view.get("certification_scheme", "Scheme I (ISI Mark)"),
        "scheme_name": tech_view.get("certification_scheme", "Scheme I (ISI Mark)"),
        "governing_order": tech_view.get("governing_order", "Central Government Notification")
    }

    # 6. Build Dynamic BIS Journey
    bis_journey = build_bis_journey(
        product_profile=updated_profile,
        recommended_standards=recommended_stds,
        certification_guidance=cert_guidance,
        testing_information=testing_info,
        laboratories=labs_info
    )

    # 7. Save Assistant Message & Citations
    assistant_msg = MessageModel(
        id=str(uuid.uuid4()),
        conversation_id=conv_id,
        sender="assistant",
        content=orch_result["answer"],
        intent=orch_result["intent"],
        confidence=orch_result["confidence"],
        evidence_status=orch_result["evidence_status"],
        payload_json=json.dumps(orch_result)
    )
    db.add(assistant_msg)

    for ev in retrieved_evidence:
        citation = CitationModel(
            id=str(uuid.uuid4()),
            message_id=assistant_msg.id,
            document_id=ev.get("document_id", "doc_general"),
            chunk_id=ev.get("id"),
            clause=ev.get("clause"),
            page=ev.get("page", 1),
            veracity_score=ev.get("score", 0.95)
        )
        db.add(citation)
        
    db.commit()

    return {
        "conversation_id": conv_id,
        "answer": orch_result["answer"],
        "intent": orch_result["intent"],
        "product": orch_result.get("product"),
        "product_profile": updated_profile,
        "evidence": retrieved_evidence,
        "recommended_standards": recommended_stds,
        "standards": recommended_stds,
        "compliance_graph": orch_result.get("compliance_graph", {}),
        "regulatory_status": orch_result.get("regulatory_status", "ACTIVE"),
        "certification_guidance": cert_guidance,
        "testing_information": testing_info,
        "laboratories": labs_info,
        "related_questions": [
            f"What specific tests are mandated for {orch_result.get('product') or 'this product'}?",
            "How do I verify a BIS mark or license number?",
            "Show latest regulatory changes and QCO orders."
        ],
        "confidence": orch_result["confidence"],
        "evidence_status": orch_result["evidence_status"],
        "grounded": orch_result["grounded"],
        "bis_journey": bis_journey,
        "actionable_next_steps": orch_result.get("actionable_next_steps", []),
        "level1_consumer_view": orch_result.get("level1_consumer_view", {}),
        "level2_technical_view": orch_result.get("level2_technical_view", {}),
        "persona_views": orch_result.get("persona_views", {}),
        "active_persona": orch_result.get("active_persona", req.persona or "consumer"),
        "semantic_changes": orch_result.get("semantic_changes", []),
        "bis_12_steps": orch_result.get("bis_12_steps", []),
        "warnings": orch_result.get("warnings", []),
        "conflicts": orch_result.get("conflicts", []),
        "last_verified": orch_result.get("last_verified"),
        "multimodal_attached": bool(req.image_base64),
        "provenance": orch_result.get("provenance", {})
    }
