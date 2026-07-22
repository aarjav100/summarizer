from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.schemas import SummaryRequest, SummaryResponse
from app.services.summarizer.generator import SummaryGeneratorService
from app.database.connection import get_db
from app.database.models import FileItem, DocumentChunk

router = APIRouter(prefix="/summarize", tags=["Summarize"])

@router.post("", response_model=SummaryResponse)
def generate_summary(payload: SummaryRequest, db: Session = Depends(get_db)):
    filename = None
    db_chunks = []
    
    try:
        file_item = db.query(FileItem).filter(FileItem.id == payload.file_id).first()
        if file_item:
            filename = file_item.filename
            db_chunks = db.query(DocumentChunk).filter(DocumentChunk.file_id == payload.file_id).order_by(DocumentChunk.chunk_index).all()
    except Exception as e:
        print(f"Database query warning in summarize: {e}")

    if db_chunks:
        content_sample = "\n\n".join([c.content for c in db_chunks])
    else:
        # Fallback to local catalog mocks
        from app.api.files import MOCK_FILES
        file_item = next((f for f in MOCK_FILES if f.id == payload.file_id), None)
        filename = file_item.filename if file_item else None

        content_sample = (
            f"Context Document: {filename or 'Generic spec'}.\n"
            "Multimodal AI Summarization SaaS Platform Technical Specification.\n"
            "Key capabilities include PDF OCR extraction, Video & Audio Whisper speech-to-text, "
            "pgvector vector search indexing, high-performance RAG context retrieval, "
            "and multi-LLM router supporting OpenAI GPT-5.5, GPT-4.1, Gemini 2.5 Flash, Claude 3.5 Sonnet, DeepSeek R1, Grok 2, and local Ollama models."
        )
    
    return SummaryGeneratorService.generate_multimodal_summary(
        content=content_sample,
        requested_types=payload.summary_types,
        model_id=payload.model_id or "gpt-4.1",
        filename=filename,
        file_id=payload.file_id
    )
