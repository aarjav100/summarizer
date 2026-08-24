import sys
import os
from dotenv import load_dotenv

# Add backend directory to sys.path and load backend/.env
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, backend_dir)
load_dotenv(os.path.join(backend_dir, '.env'))

from sqlalchemy import text
from app.database.connection import SessionLocal, engine
from app.database.models import User, Project, FileItem
from app.services.retention.cleanup import RetentionCleanupService

def run_migration_and_cleanup():
    print("Starting database migration and file cleanup audit...")
    db = SessionLocal()

    try:
        # 1. Add user_id, is_single_use, single_use_consumed columns to 'files' table if missing
        with engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE files ADD COLUMN user_id VARCHAR;"))
                conn.commit()
                print("  [OK] Added user_id column to files table.")
            except Exception:
                pass

            try:
                conn.execute(text("ALTER TABLE files ADD COLUMN is_single_use BOOLEAN DEFAULT TRUE;"))
                conn.commit()
                print("  [OK] Added is_single_use column to files table.")
            except Exception:
                pass

            try:
                conn.execute(text("ALTER TABLE files ADD COLUMN single_use_consumed BOOLEAN DEFAULT FALSE;"))
                conn.commit()
                print("  [OK] Added single_use_consumed column to files table.")
            except Exception:
                pass

        # 2. Ensure default system user exists
        default_user = db.query(User).filter(User.id == "user-default-id").first()
        if not default_user:
            default_user = User(
                id="user-default-id",
                clerk_id="clerk-default-id",
                email="default@summarizer.ai",
                full_name="System Default User"
            )
            db.add(default_user)
            db.commit()

        # 3. Backfill user_id on any unowned FileItem records
        unowned_files = db.query(FileItem).filter(
            (FileItem.user_id == None) | (FileItem.user_id == "")
        ).all()

        backfilled_count = 0
        for f in unowned_files:
            # Match via project user_id
            parent_project = db.query(Project).filter(Project.id == f.project_id).first()
            if parent_project and parent_project.user_id:
                f.user_id = parent_project.user_id
            else:
                f.user_id = default_user.id
            backfilled_count += 1

        db.commit()
        print(f"  [OK] Backfilled user_id on {backfilled_count} existing file records.")

        # 4. Trigger automated cleanup of expired or single-use files
        cleanup_res = RetentionCleanupService.purge_expired_files(db)
        print(f"  [OK] Cleanup audit result: {cleanup_res}")

        print("Migration and file security audit complete!")
    except Exception as e:
        db.rollback()
        print(f"Error during migration: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    run_migration_and_cleanup()
