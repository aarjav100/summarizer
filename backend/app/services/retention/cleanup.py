import os
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database.models import FileItem, DocumentChunk, SummaryResult, ChatSession, ChatMessage

class RetentionCleanupService:
    """
    Automated 15-Day Data Retention and Cleanup Engine.
    Purges expired document records, extracted text, vector chunks,
    embeddings, summaries, temporary files, and associated chat history.
    Operation is strictly idempotent and privacy-compliant (no document logging).
    """

    @staticmethod
    def purge_expired_files(db: Session) -> Dict[str, Any]:
        """
        Scans for files where expires_at <= current_time and cleanup_status != 'deleted'.
        Deletes all associated database records, vector chunks, and files safely.
        """
        now = datetime.utcnow()
        expired_files: List[FileItem] = []

        try:
            expired_files = db.query(FileItem).filter(
                FileItem.expires_at <= now,
                FileItem.cleanup_status != "deleted"
            ).all()
        except Exception as query_err:
            print(f"[RETENTION CLEANUP WARNING] Could not query expired files: {query_err}")
            return {"purged_count": 0, "status": "query_failed", "error": str(query_err)}

        purged_count = 0
        errors_count = 0

        for file_item in expired_files:
            file_id = file_item.id
            file_name = file_item.filename

            try:
                # 1. Delete associated DocumentChunks and vector embeddings
                try:
                    db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).delete(synchronize_session=False)
                except Exception as chunk_err:
                    print(f"[RETENTION CLEANUP] Non-fatal chunk delete error for file_id {file_id}: {chunk_err}")

                # 2. Delete associated SummaryResults
                try:
                    db.query(SummaryResult).filter(SummaryResult.file_id == file_id).delete(synchronize_session=False)
                except Exception as summary_err:
                    print(f"[RETENTION CLEANUP] Non-fatal summary delete error for file_id {file_id}: {summary_err}")

                # 3. Delete associated ChatSessions & ChatMessages
                try:
                    sessions = db.query(ChatSession).filter(ChatSession.file_id == file_id).all()
                    for session in sessions:
                        db.query(ChatMessage).filter(ChatMessage.chat_id == session.id).delete(synchronize_session=False)
                        db.delete(session)
                except Exception as chat_err:
                    print(f"[RETENTION CLEANUP] Non-fatal chat delete error for file_id {file_id}: {chat_err}")

                # 4. Remove local or temporary disk file if storage_url points to a local file
                if file_item.storage_url and file_item.storage_url.startswith("/storage/"):
                    local_path = file_item.storage_url.replace("/storage/", "")
                    if os.path.exists(local_path):
                        try:
                            os.remove(local_path)
                        except Exception as file_del_err:
                            print(f"[RETENTION CLEANUP] Non-fatal file removal error for path {local_path}: {file_del_err}")

                # 5. Clear sensitive extracted text & mark cleanup_status as deleted before final DB commit/delete
                file_item.ocr_extracted_text = None
                file_item.storage_url = None
                file_item.source_url = None
                file_item.cleanup_status = "deleted"

                # Delete the FileItem row completely from database
                db.delete(file_item)
                db.commit()

                purged_count += 1
                # Privacy-conscious log: Log ID, filename, and timestamps WITHOUT logging document contents
                print(f"[RETENTION CLEANUP SUCCESS] Purged expired file ID: {file_id} ({file_name}) - Expired at: {file_item.expires_at}")

            except Exception as item_err:
                db.rollback()
                errors_count += 1
                print(f"[RETENTION CLEANUP ERROR] Idempotent handling error for file ID {file_id}: {item_err}")
                continue

        return {
            "timestamp": now.isoformat(),
            "purged_count": purged_count,
            "errors_count": errors_count,
            "status": "completed"
        }
