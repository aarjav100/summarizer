from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.schemas import FileItemResponse
from app.database.connection import get_db
from app.database.models import FileItem, DocumentChunk
from app.services.ocr.ocr_engine import OCREngineService
from app.services.speech.speech_engine import SpeechEngineService
from app.services.crawler.web_scraper import WebScraperService
from app.services.rag.pipeline import RAGPipelineService
from datetime import datetime
import uuid
import os
import traceback

router = APIRouter(prefix="/files", tags=["Files"])

MOCK_FILES = [
    FileItemResponse(
        id="file-101", project_id="proj-1", filename="LLM_Multimodal_RAG_Architecture.pdf",
        file_type="pdf", file_size_bytes=4200000, storage_url="https://example.com/file1.pdf",
        source_url=None, status="completed", is_favorite=True, created_at=datetime.utcnow()
    ),
    FileItemResponse(
        id="file-102", project_id="proj-1", filename="System_Architecture_Diagram.png",
        file_type="image", file_size_bytes=1500000, storage_url="https://example.com/diagram.png",
        source_url=None, status="completed", is_favorite=False, created_at=datetime.utcnow()
    ),
    FileItemResponse(
        id="file-103", project_id="proj-3", filename="https://www.youtube.com/watch?v=demo",
        file_type="video", file_size_bytes=0, storage_url=None,
        source_url="https://www.youtube.com/watch?v=demo", status="completed", is_favorite=False, created_at=datetime.utcnow()
    )
]

@router.get("", response_model=List[FileItemResponse])
def list_files(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    try:
        query = db.query(FileItem)
        if project_id:
            query = query.filter(FileItem.project_id == project_id)
        db_files = query.order_by(FileItem.created_at.desc()).all()

        if db_files:
            results = []
            for f in db_files:
                results.append(FileItemResponse(
                    id=f.id, project_id=f.project_id, filename=f.filename,
                    file_type=f.file_type, file_size_bytes=f.file_size_bytes,
                    storage_url=f.storage_url, source_url=f.source_url,
                    status=f.status, is_favorite=f.is_favorite, created_at=f.created_at
                ))
            return results
        else:
            # Database is reachable but no files exist yet — return empty list
            # (NOT the mocks, so the frontend knows there are genuinely no files)
            return []
    except Exception as e:
        print(f"Database read warning: {e}")

    # Fallback to mocks only when database is completely unreachable
    if project_id:
        return [f for f in MOCK_FILES if f.project_id == project_id]
    return MOCK_FILES

@router.post("/upload", response_model=FileItemResponse)
async def upload_file(
    project_id: str = Form(...),
    file_type: str = Form(...), # 'pdf', 'image', 'video', 'audio', 'url', 'text'
    file: Optional[UploadFile] = File(None),
    source_url: Optional[str] = Form(None),
    text_content: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    filename = "Pasted_Text.txt"
    size = len(text_content.encode()) if text_content else 0
    extracted_text = text_content or ""
    content_bytes = b""

    if file:
        filename = file.filename
        content_bytes = await file.read()
        size = len(content_bytes)
        
        # Validation checks
        if size > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds maximum 50MB limit.")

        # Extract text based on file format
        if file_type == "pdf":
            extracted_text = OCREngineService.extract_text_from_pdf(content_bytes)
        elif file_type == "image":
            ocr_res = OCREngineService.extract_text_from_image(content_bytes)
            extracted_text = ocr_res.get("ocr_text", "")
        elif file_type in ["audio", "video"]:
            extracted_text = SpeechEngineService.transcribe_audio(content_bytes)
        else:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")

    elif source_url:
        filename = source_url
        extracted_text = WebScraperService.scrape_url(source_url)

    file_id = f"file-{uuid.uuid4().hex[:6]}"

    # Save to database — this MUST succeed for the file to persist
    try:
        from app.database.models import User, Project
        
        # 1. Ensure default user exists (since Project belongs to User and user_id is Not Null)
        default_user_id = "user-default-id"
        user_exists = db.query(User).filter(User.id == default_user_id).first()
        if not user_exists:
            db_user = User(
                id=default_user_id,
                clerk_id="clerk-default-id",
                email="default@example.com",
                full_name="Default User"
            )
            db.add(db_user)
            db.commit()
            
        # 2. Ensure project exists (since FileItem belongs to Project and project_id is Not Null)
        project_exists = db.query(Project).filter(Project.id == project_id).first()
        if not project_exists:
            db_project = Project(
                id=project_id,
                user_id=default_user_id,
                name="Active Workspace",
                description="Auto-generated workspace context"
            )
            db.add(db_project)
            db.commit()

        # Create database file record
        db_file = FileItem(
            id=file_id,
            project_id=project_id,
            filename=filename,
            file_type=file_type,
            file_size_bytes=size,
            storage_url=f"/storage/{filename}",
            source_url=source_url,
            ocr_extracted_text=extracted_text,
            status="completed",
            is_favorite=False,
            created_at=datetime.utcnow()
        )
        db.add(db_file)
        db.commit()

        # Chunk the text and generate embeddings (non-critical — don't fail upload if this errors)
        try:
            chunks = RAGPipelineService.split_into_chunks(extracted_text)
            for chunk in chunks:
                embedding_vector = RAGPipelineService.generate_dummy_embedding(chunk["content"])
                
                db_chunk = DocumentChunk(
                    id=f"chk-{uuid.uuid4().hex[:6]}",
                    file_id=file_id,
                    chunk_index=chunk["chunk_index"],
                    content=chunk["content"],
                    page_number=chunk["page_number"],
                    timestamp_seconds=chunk["timestamp_seconds"],
                    embedding=embedding_vector
                )
                db.add(db_chunk)
            db.commit()
        except Exception as chunk_err:
            print(f"Warning: Chunking/embedding failed (file still saved): {chunk_err}")
            db.rollback()

        print(f"File {filename} successfully saved in Supabase database.")
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        error_detail = traceback.format_exc()
        print(f"DATABASE WRITE FAILED during upload:\n{error_detail}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file to database: {str(e)}"
        )

    return FileItemResponse(
        id=file_id,
        project_id=project_id,
        filename=filename,
        file_type=file_type,
        file_size_bytes=size,
        storage_url=f"/storage/{filename}",
        source_url=source_url,
        status="completed",
        is_favorite=False,
        created_at=datetime.utcnow()
    )
