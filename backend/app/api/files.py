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

from app.api.auth import verify_clerk_token, get_or_create_db_user
from app.services.retention.cleanup import RetentionCleanupService

router = APIRouter(prefix="/files", tags=["Files"])

@router.get("", response_model=List[FileItemResponse])
def list_files(
    project_id: Optional[str] = None,
    token_payload: dict = Depends(verify_clerk_token),
    db: Session = Depends(get_db)
):
    """Returns files owned strictly by the authenticated requesting user."""
    db_user = get_or_create_db_user(db, token_payload)
    
    try:
        query = db.query(FileItem).filter(
            FileItem.user_id == db_user.id,
            FileItem.cleanup_status == "active"
        )
        if project_id:
            query = query.filter(FileItem.project_id == project_id)
        db_files = query.order_by(FileItem.created_at.desc()).all()

        results = []
        for f in db_files:
            results.append(FileItemResponse(
                id=f.id,
                user_id=f.user_id,
                project_id=f.project_id,
                filename=f.filename,
                file_type=f.file_type,
                file_size_bytes=f.file_size_bytes,
                storage_url=f.storage_url,
                source_url=f.source_url,
                status=f.status,
                is_favorite=f.is_favorite,
                is_single_use=f.is_single_use,
                single_use_consumed=f.single_use_consumed,
                created_at=f.created_at
            ))
        return results
    except Exception as e:
        print(f"Database read warning: {e}")
        return []

@router.get("/{file_id}", response_model=FileItemResponse)
def get_file(
    file_id: str,
    token_payload: dict = Depends(verify_clerk_token),
    db: Session = Depends(get_db)
):
    """Fetches a specific file. Verifies requesting user is the authenticated owner."""
    db_user = get_or_create_db_user(db, token_payload)

    file_item = db.query(FileItem).filter(
        FileItem.id == file_id,
        FileItem.user_id == db_user.id,
        FileItem.cleanup_status == "active"
    ).first()

    if not file_item or file_item.single_use_consumed:
        raise HTTPException(status_code=404, detail="File not found, expired, or access denied.")

    return FileItemResponse(
        id=file_item.id,
        user_id=file_item.user_id,
        project_id=file_item.project_id,
        filename=file_item.filename,
        file_type=file_item.file_type,
        file_size_bytes=file_item.file_size_bytes,
        storage_url=file_item.storage_url,
        source_url=file_item.source_url,
        status=file_item.status,
        is_favorite=file_item.is_favorite,
        is_single_use=file_item.is_single_use,
        single_use_consumed=file_item.single_use_consumed,
        created_at=file_item.created_at
    )

@router.post("/upload", response_model=FileItemResponse)
async def upload_file(
    project_id: str = Form(...),
    file_type: str = Form(...), # 'pdf', 'image', 'video', 'audio', 'url', 'text'
    file: Optional[UploadFile] = File(None),
    source_url: Optional[str] = Form(None),
    text_content: Optional[str] = Form(None),
    is_single_use: bool = Form(True),
    token_payload: dict = Depends(verify_clerk_token),
    db: Session = Depends(get_db)
):
    """Uploads document/file bound strictly to authenticated user_id with single-use retention."""
    db_user = get_or_create_db_user(db, token_payload)

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

        # Extract text based on file format safely
        try:
            if file_type == "pdf":
                extracted_text = OCREngineService.extract_text_from_pdf(content_bytes)
            elif file_type == "image":
                ocr_res = OCREngineService.extract_text_from_image(content_bytes)
                extracted_text = ocr_res.get("ocr_text", "") if isinstance(ocr_res, dict) else str(ocr_res)
            elif file_type in ["audio", "video"]:
                extracted_text = SpeechEngineService.transcribe_audio(content_bytes)
            else:
                extracted_text = content_bytes.decode("utf-8", errors="ignore")
        except Exception as extract_err:
            print(f"Warning: Text extraction failed for {filename}: {extract_err}")
            extracted_text = f"Content from uploaded file: {filename}"

    elif source_url:
        filename = source_url
        try:
            extracted_text = WebScraperService.scrape_url(source_url)
        except Exception as scrape_err:
            print(f"Warning: Scrape failed for {source_url}: {scrape_err}")
            extracted_text = f"Scraped content from {source_url}"

    file_id = f"file-{uuid.uuid4().hex[:6]}"

    # Save to database
    try:
        from app.database.models import Project
        
        # Ensure project exists
        project_exists = db.query(Project).filter(Project.id == project_id).first()
        if not project_exists:
            db_project = Project(
                id=project_id,
                user_id=db_user.id,
                name="Active Workspace",
                description="Auto-generated workspace context"
            )
            db.add(db_project)
            db.commit()

        from datetime import timedelta
        from app.services.nlp.processor import NLPProcessorService

        now = datetime.utcnow()
        expires = now + timedelta(days=15)

        # Create database file record linked directly to db_user.id
        db_file = FileItem(
            id=file_id,
            user_id=db_user.id,
            project_id=project_id,
            filename=filename,
            file_type=file_type,
            file_size_bytes=size,
            storage_url=f"/storage/{filename}",
            source_url=source_url,
            ocr_extracted_text=extracted_text,
            status="completed",
            is_favorite=False,
            is_single_use=is_single_use,
            single_use_consumed=False,
            created_at=now,
            uploaded_at=now,
            expires_at=expires,
            cleanup_status="active"
        )
        db.add(db_file)
        db.commit()

        # Chunk text using NLP structure-aware chunking and generate embeddings
        try:
            chunks = NLPProcessorService.structure_aware_chunking(extracted_text)
            if not chunks:
                chunks = RAGPipelineService.split_into_chunks(extracted_text)

            for chunk in chunks:
                embedding_vector = RAGPipelineService.generate_dummy_embedding(chunk["content"])
                
                db_chunk = DocumentChunk(
                    id=f"chk-{uuid.uuid4().hex[:6]}",
                    file_id=file_id,
                    chunk_index=chunk["chunk_index"],
                    content=chunk["content"],
                    page_number=chunk.get("page_number", 1),
                    timestamp_seconds=chunk.get("timestamp_seconds", 0.0),
                    embedding=embedding_vector
                )
                db.add(db_chunk)
            db.commit()
        except Exception as chunk_err:
            print(f"Warning: Chunking/embedding failed (file still saved): {chunk_err}")
            db.rollback()

        print(f"File {filename} successfully saved in Supabase database for user {db_user.id}.")
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
        user_id=db_user.id,
        project_id=project_id,
        filename=filename,
        file_type=file_type,
        file_size_bytes=size,
        storage_url=f"/storage/{filename}",
        source_url=source_url,
        status="completed",
        is_favorite=False,
        is_single_use=is_single_use,
        single_use_consumed=False,
        created_at=datetime.utcnow()
    )

@router.delete("/{file_id}")
def delete_file(
    file_id: str,
    token_payload: dict = Depends(verify_clerk_token),
    db: Session = Depends(get_db)
):
    """Deletes physical file, vector embeddings, chunks, and DB record for authenticated owner."""
    db_user = get_or_create_db_user(db, token_payload)

    res = RetentionCleanupService.delete_file_immediately(file_id, db_user.id, db)
    if res.get("status") in ["not_found", "unauthorized"]:
        raise HTTPException(status_code=404, detail="File not found, expired, or access denied.")

    return res

@router.post("/{file_id}/consume")
def consume_file(
    file_id: str,
    token_payload: dict = Depends(verify_clerk_token),
    db: Session = Depends(get_db)
):
    """Triggers single-use consumption and immediate purging of stored document data."""
    db_user = get_or_create_db_user(db, token_payload)

    res = RetentionCleanupService.delete_file_immediately(file_id, db_user.id, db)
    if res.get("status") in ["not_found", "unauthorized"]:
        raise HTTPException(status_code=404, detail="File not found, expired, or access denied.")

    return {"status": "consumed_and_purged", "file_id": file_id}

@router.post("/cleanup")
def trigger_retention_cleanup(db: Session = Depends(get_db)):
    """Triggers automated data retention cleanup operation."""
    return RetentionCleanupService.purge_expired_files(db)


