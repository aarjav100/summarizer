from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.schemas import ChatMessageCreate, ChatMessageResponse, Citation
from app.services.llm.provider import LLMProviderService
from app.services.rag.pipeline import RAGPipelineService
from app.database.connection import get_db
from app.database.models import FileItem, DocumentChunk
from datetime import datetime
import uuid

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatMessageResponse)
def post_chat_message(payload: ChatMessageCreate, db: Session = Depends(get_db)):
    filename = None
    db_chunks = []
    full_context_text = None
    
    try:
        file_item = db.query(FileItem).filter(FileItem.id == payload.file_id).first() if payload.file_id else None
        if file_item:
            filename = file_item.filename
            if payload.use_full_context:
                full_context_text = file_item.ocr_extracted_text
            else:
                db_chunks = db.query(DocumentChunk).filter(DocumentChunk.file_id == payload.file_id).order_by(DocumentChunk.chunk_index).all()
    except Exception as e:
        print(f"Database query warning in chat: {e}")

    citations = []
    if payload.use_full_context and (full_context_text or filename):
        citations.append(Citation(
            chunk_id="whole-doc",
            page_number=1,
            timestamp_seconds=0.0,
            source_text="Grounded in full document context (no chunking/RAG distance filters applied)."
        ))
        context_text = full_context_text or ""
        prompt = f"Answer query: '{payload.message}' using retrieved citations from document.\n\nContent:\n{context_text}"
        
    elif db_chunks:
        # Build list of dicts for relevance retrieval
        chunks_list = [{
            "chunk_index": c.chunk_index,
            "content": c.content,
            "page_number": c.page_number,
            "timestamp_seconds": c.timestamp_seconds
        } for c in db_chunks]
        
        relevant_chunks = RAGPipelineService.retrieve_relevant_chunks(chunks_list, payload.message, top_k=3)
        for idx, chunk in enumerate(relevant_chunks):
            citations.append(Citation(
                chunk_id=f"chk-{chunk['chunk_index']}",
                page_number=chunk["page_number"],
                timestamp_seconds=chunk["timestamp_seconds"],
                source_text=chunk["content"][:200]
            ))
        
        context_text = "\n\n".join([c["content"] for c in relevant_chunks])
        prompt = f"Answer query: '{payload.message}' using retrieved citations from document.\n\nContent:\n{context_text}"
    else:
        if not payload.file_id:
            prompt = payload.message
            citations.append(Citation(
                chunk_id="general",
                page_number=1,
                timestamp_seconds=0.0,
                source_text="General Knowledge Mode (chat operated without active document context)."
            ))
        else:
            # Fallback catalog mocks
            from app.api.files import MOCK_FILES
            file_item = next((f for f in MOCK_FILES if f.id == payload.file_id), None)
            filename = file_item.filename if file_item else None

            citations.append(Citation(
                chunk_id="chk_101",
                page_number=3,
                timestamp_seconds=145.0,
                source_text=f"Semantic page data parsed from {filename or 'the document source'}."
            ))
            
            prompt = f"Answer user query: '{payload.message}' using retrieved citations from {filename or 'the active document'}."

    res = LLMProviderService.generate_completion(prompt=prompt, model_id=payload.model_id or "gpt-4.1", filename=filename)

    return ChatMessageResponse(
        id=f"msg-{uuid.uuid4().hex[:6]}",
        sender="assistant",
        content=res["content"],
        citations=citations,
        model_name=payload.model_id or "GPT-4.1 Turbo",
        created_at=datetime.utcnow()
    )
