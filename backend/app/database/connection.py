from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
from app.database.models import Base
import ssl

# ──────────────────────────────────────────────────────────────────────
# SQLAlchemy Engine using pg8000 (pure Python PostgreSQL driver)
#
# Why pg8000 instead of psycopg2/psycopg?
#   - Supabase's Connection Pooler (Supavisor) requires TLS with SNI
#   - psycopg2/psycopg use libpq (C library) for TLS, and the bundled
#     libpq on Render does NOT send SNI → ENOIDENTIFIER error
#   - pg8000 uses Python's native `ssl` module which ALWAYS sends SNI
#     via ssl.wrap_socket(server_hostname=host)
#   - The pooler endpoint (pooler.supabase.com:6543) is IPv4-compatible,
#     avoiding Render's IPv6 connectivity issues with direct connections
# ──────────────────────────────────────────────────────────────────────

db_url = settings.DATABASE_URL

# Validate DATABASE_URL is configured
if not db_url or db_url == "postgresql://postgres:postgres@localhost:5432/summarizer":
    print("WARNING: DATABASE_URL is not configured — using localhost fallback.")

# Set SQLAlchemy to use the pg8000 driver
# Convert: postgresql:// → postgresql+pg8000://
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)
elif db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+pg8000://", 1)

# Configure SSL context for pg8000 — Python's ssl module sends SNI natively
# This is what makes the Supabase pooler connection work from Render
connect_args = {}
if "supabase" in settings.DATABASE_URL:
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    connect_args["ssl_context"] = ssl_ctx

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Session Local class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes schema tables in Supabase Postgres on startup."""
    try:
        # Enable pgvector extension before creating tables
        with engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        
        # Create all tables defined in models.py
        Base.metadata.create_all(bind=engine)
        print("Supabase database tables successfully initialized.")
    except Exception as e:
        print(f"Database initialization warning: {e}")
