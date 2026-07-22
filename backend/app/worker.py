from celery import Celery
from app.config.settings import settings

# Initialize Celery Worker using Redis Broker configuration
celery_app = Celery(
    "tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="app.worker.process_document_file")
def process_document_file(file_id: str):
    """Asynchronously processes uploaded document (OCR text extraction, pgvector chunking, and database indexing)."""
    # Lazily import dependencies to prevent startup circular imports
    from app.database.connection import SessionLocal
    from app.database.models import FileItem, DocumentChunk
    from app.services.rag.pipeline import RAGPipelineService
    
    db = SessionLocal()
    try:
        file_item = db.query(FileItem).filter(FileItem.id == file_id).first()
        if not file_item:
            return f"Error: File {file_id} not found."
            
        print(f"Celery processing document '{file_item.filename}' in the background...")
        extracted_text = file_item.ocr_extracted_text or ""
        
        # Step 1: Divide text into semantic chunks
        chunks = RAGPipelineService.chunk_document(extracted_text, chunk_size=800, overlap=150)
        
        # Step 2: Delete old indexing chunks if they exist
        db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).delete()
        
        # Step 3: Compute embeddings and save to pgvector database
        for idx, chunk_content in enumerate(chunks):
            embedding = RAGPipelineService.generate_embedding(chunk_content)
            
            db_chunk = DocumentChunk(
                file_id=file_id,
                chunk_index=idx,
                content=chunk_content,
                embedding=embedding,
                page_number=1 + (idx // 4)
            )
            db.add(db_chunk)
            
        db.commit()
        print(f"Successfully chunked and indexed {len(chunks)} segments in pgvector db.")
        return f"File {file_item.filename} successfully indexed."
        
    except Exception as e:
        db.rollback()
        print(f"Celery document processing exception: {e}")
        return f"Error: {e}"
    finally:
        db.close()
