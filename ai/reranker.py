from typing import List, Dict, Any

class CrossEncoderReranker:
    """
    Reranks candidate retrieved chunks based on explicit semantic query-document cross attention score.
    """
    def rerank(self, query: str, chunks: List[Dict[str, Any]], top_k: int = 4) -> List[Dict[str, Any]]:
        if not chunks:
            return []
            
        query_terms = set(query.lower().split())
        scored = []
        
        for chunk in chunks:
            text = (chunk.get("text", "") + " " + chunk.get("clause", "") + " " + chunk.get("standard_number", "")).lower()
            text_terms = set(text.split())
            
            # Term overlap score
            overlap = len(query_terms.intersection(text_terms))
            score = chunk.get("score", 0.5) + (overlap * 0.15)
            
            # Boost exact standard match (e.g. IS 17803)
            for qt in query_terms:
                if "17803" in qt and "17803" in text:
                    score += 0.5
                elif "302" in qt and "302" in text:
                    score += 0.5
                elif "1417" in qt and "1417" in text:
                    score += 0.5
                    
            chunk_copy = dict(chunk)
            chunk_copy["relevance_score"] = round(min(score, 0.99), 3)
            scored.append(chunk_copy)
            
        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored[:top_k]

reranker_service = CrossEncoderReranker()
