import re
from typing import List, Dict, Any

class SemanticClauseChunker:
    """
    Splits standard documents preserving clause boundary integrity.
    Ensures clauses (e.g., Clause 4.1, Clause 5.2) are kept intact.
    """
    def chunk_document(self, doc_id: str, title: str, text: str) -> List[Dict[str, Any]]:
        # Regex to detect clauses
        clause_pattern = r"(Clause\s+\d+(\.\d+)*[A-Za-z]?|Section\s+\d+(\.\d+)*)"
        splits = re.split(clause_pattern, text)
        
        chunks = []
        current_clause = "Clause 1.1 Scope"
        current_section = "General Requirements"
        buffer = []
        page_num = 1
        
        lines = text.split("\n")
        for line in lines:
            if "Page " in line:
                m = re.search(r"Page\s+(\d+)", line)
                if m:
                    page_num = int(m.group(1))
                    
            m_clause = re.search(r"(Clause\s+\d+(\.\d+)*|Section\s+\d+(\.\d+)?)", line, re.IGNORECASE)
            if m_clause and buffer:
                chunk_text = "\n".join(buffer).strip()
                if len(chunk_text) > 30:
                    chunks.append({
                        "document_id": doc_id,
                        "text": chunk_text,
                        "section": current_section,
                        "clause": current_clause,
                        "page": page_num
                    })
                buffer = []
                current_clause = m_clause.group(0).title()
                
            buffer.append(line)
            
        if buffer:
            chunk_text = "\n".join(buffer).strip()
            if len(chunk_text) > 30:
                chunks.append({
                    "document_id": doc_id,
                    "text": chunk_text,
                    "section": current_section,
                    "clause": current_clause,
                    "page": page_num
                })
                
        return chunks

chunker_service = SemanticClauseChunker()
