import json
import numpy as np
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.db.models import ChunkModel, DocumentModel
from ai.embeddings import embedding_service
from ai.reranker import reranker_service

PRODUCT_KEYWORD_MAP = {
    "Mobile Phone": ["mobile", "phone", "smartphone", "13252", "62368", "16046", "16333", "crs", "it equipment"],
    "Power Adapter": ["adapter", "charger", "fast charging", "13252", "power delivery"],
    "Domestic Pressure Cooker": ["cooker", "pressure cooker", "2347", "burst", "gasket", "vent"],
    "Stainless Steel Water Bottle": ["bottle", "flask", "water bottle", "17803", "vacuum", "thermal insulation"],
    "Electric Kettle": ["kettle", "boiling", "302-2-15", "liquid heating", "dry boil"],
    "Gold Jewellery & Artefacts": ["gold", "jewellery", "jewelry", "1417", "hallmark", "huid", "carat", "karat"],
    "Protective Helmet": ["helmet", "helmets", "motorcycle", "4151", "head protection"],
    "Secondary Lithium-ion Battery": ["battery", "lithium", "16046", "cell", "thermal runaway"],
    "Safety of Toys": ["toy", "toys", "9873", "children"],
    "LED Bulb": ["led", "bulb", "16102", "lighting"]
}

class HybridRetriever:
    """
    Executes Vector Search + Keyword Search over indexed BIS chunks,
    merges candidates, applies product and intent filters, and reranks candidates.
    """
    def search(
        self,
        db: Session,
        query: str,
        intent: Optional[str] = None,
        product_profile: Optional[Dict[str, Any]] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        chunks = db.query(ChunkModel, DocumentModel).\
            join(DocumentModel, ChunkModel.document_id == DocumentModel.id).all()
            
        if not chunks:
            return []
            
        query_vec = embedding_service.encode(query)
        query_terms = [q.lower() for q in query.split() if len(q) > 2]
        
        target_product = product_profile.get("product") if product_profile else None
        
        candidates = []
        
        for chk, doc in chunks:
            text_full = (
                chk.text + " " +
                (chk.clause or "") + " " +
                (chk.section or "") + " " +
                (doc.standard_number or "") + " " +
                doc.title
            ).lower()
            
            # 1. Keyword / BM25 score
            kw_hits = sum(1 for term in query_terms if term in text_full)
            kw_score = kw_hits / max(len(query_terms), 1)
            
            # 2. Vector Cosine Similarity proxy
            doc_vec = embedding_service.encode(chk.text)
            vec_score = float(np.dot(query_vec, doc_vec))
            
            # 3. Product context boost
            prod_boost = 0.0
            if target_product and target_product in PRODUCT_KEYWORD_MAP:
                related_kws = PRODUCT_KEYWORD_MAP[target_product]
                if any(kw in text_full for kw in related_kws):
                    prod_boost = 0.45
            else:
                # Check if any query term matches product keyword map directly
                for prod_name, kws in PRODUCT_KEYWORD_MAP.items():
                    if any(kw in query.lower() for kw in kws):
                        if any(kw in text_full for kw in kws):
                            prod_boost = 0.40
                            break

            # 4. Intent boost
            intent_boost = 0.0
            if intent == "TESTING" and ("test" in text_full or "clause 5" in text_full or "clause 6" in text_full or "clause 4" in text_full):
                intent_boost = 0.20
            elif intent == "CERTIFICATION" and ("scheme" in text_full or "marking" in text_full or "crs" in text_full or "cml" in text_full):
                intent_boost = 0.20
            elif intent == "HALLMARKING" and ("hallmark" in text_full or "1417" in text_full or "huid" in text_full):
                intent_boost = 0.35
            elif intent == "CONSUMER" and ("verify" in text_full or "app" in text_full or "care" in text_full):
                intent_boost = 0.20
                
            combined_score = (vec_score * 0.3) + (kw_score * 0.3) + prod_boost + intent_boost
            
            if combined_score > 0.15 or kw_hits > 0 or prod_boost > 0:
                candidates.append({
                    "id": chk.id,
                    "document_id": doc.id,
                    "document_title": doc.title,
                    "standard_number": doc.standard_number,
                    "clause": chk.clause or "General Section",
                    "section": chk.section,
                    "page": chk.page or 1,
                    "text": chk.text,
                    "source": doc.source,
                    "source_type": doc.source_type or "DEMO_BENCHMARK",
                    "effective_date": doc.effective_date,
                    "status": doc.status or "CURRENT",
                    "score": round(combined_score, 3)
                })
                
        # Sort and rerank
        return reranker_service.rerank(query, candidates, top_k=top_k)

hybrid_retriever_service = HybridRetriever()
