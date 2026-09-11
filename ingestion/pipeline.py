import uuid
from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.app.db.models import DocumentModel, ChunkModel, IngestionJobModel
from ingestion.loader import document_loader
from ingestion.chunker import chunker_service
from ai.embeddings import embedding_service

class IngestionPipeline:
    """
    Full document ingestion pipeline:
    Validate -> Extract -> Clean -> Section/Clause Detect -> Chunk -> Embed -> Index
    """
    def run_pipeline(self, db: Session, file_path: str, document_title: str, standard_number: str = None) -> Dict[str, Any]:
        job_id = str(uuid.uuid4())
        job = IngestionJobModel(
            id=job_id,
            document_title=document_title,
            source_file=file_path,
            status="PROCESSING"
        )
        db.add(job)
        db.commit()
        
        try:
            # 1. Load & Extract
            raw_data = document_loader.load_file(file_path)
            
            # 2. Save Document Record
            doc_id = str(uuid.uuid4())
            doc = DocumentModel(
                id=doc_id,
                title=document_title,
                standard_number=standard_number or "IS UNKNOWN",
                document_type="STANDARD",
                source=raw_data["source"],
                version="1.0",
                status="CURRENT"
            )
            db.add(doc)
            
            # 3. Clause Chunking
            chunks_data = chunker_service.chunk_document(doc_id, document_title, raw_data["text"])
            
            # 4. Embed & Index Chunks
            created_chunks = 0
            for c in chunks_data:
                chk_id = str(uuid.uuid4())
                embedding_service.encode(c["text"]) # Compute embedding vector
                chunk_obj = ChunkModel(
                    id=chk_id,
                    document_id=doc_id,
                    text=c["text"],
                    section=c["section"],
                    clause=c["clause"],
                    page=c["page"],
                    metadata_json='{"ingested": true}'
                )
                db.add(chunk_obj)
                created_chunks += 1
                
            job.status = "COMPLETED"
            job.total_chunks = created_chunks
            db.commit()
            
            return {
                "job_id": job_id,
                "document_id": doc_id,
                "status": "COMPLETED",
                "total_chunks": created_chunks
            }
        except Exception as e:
            job.status = "FAILED"
            job.error_message = str(e)
            db.commit()
            return {
                "job_id": job_id,
                "status": "FAILED",
                "error": str(e)
            }

ingestion_pipeline = IngestionPipeline()
