from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.schemas import SummaryRequest, SummaryResponse
from app.services.summarizer.generator import SummaryGeneratorService
from app.database.connection import get_db
from app.database.models import FileItem, DocumentChunk

from app.api.auth import verify_clerk_token, get_or_create_db_user
from app.services.retention.cleanup import RetentionCleanupService

router = APIRouter(prefix="/summarize", tags=["Summarize"])

@router.post("", response_model=SummaryResponse)
def generate_summary(
    payload: SummaryRequest,
    token_payload: dict = Depends(verify_clerk_token),
    db: Session = Depends(get_db)
):
    """Generates multimodal summary for document owned by requesting user with single-use auto-delete."""
    db_user = get_or_create_db_user(db, token_payload)

    file_item = db.query(FileItem).filter(
        FileItem.id == payload.file_id,
        FileItem.user_id == db_user.id,
        FileItem.cleanup_status == "active"
    ).first()

    if not file_item or file_item.single_use_consumed:
        raise HTTPException(status_code=404, detail="File not found, expired, or access denied.")

    filename = file_item.filename
    is_single_use = file_item.is_single_use

    db_chunks = db.query(DocumentChunk).filter(
        DocumentChunk.file_id == payload.file_id
    ).order_by(DocumentChunk.chunk_index).all()

    if db_chunks:
        content_sample = "\n\n".join([c.content for c in db_chunks])
    elif file_item.ocr_extracted_text:
        content_sample = file_item.ocr_extracted_text
    else:
        content_sample = f"Context Document: {filename}"

    res = SummaryGeneratorService.generate_multimodal_summary(
        content=content_sample,
        requested_types=payload.summary_types,
        model_id=payload.model_id or "gpt-4.1",
        filename=filename,
        file_id=payload.file_id
    )

    # Single-Use Auto-Delete Guarantee: Purge raw file, OCR text, and chunks post-synthesis
    if is_single_use:
        try:
            RetentionCleanupService.delete_file_immediately(payload.file_id, db_user.id, db)
            print(f"[SINGLE-USE AUTO-DELETE SUCCESS] Purged raw file {payload.file_id} after summary generation.")
        except Exception as cleanup_err:
            print(f"[SINGLE-USE AUTO-DELETE WARNING] Post-synthesis cleanup error: {cleanup_err}")

    return res


