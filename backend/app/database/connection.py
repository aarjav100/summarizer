from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
from app.database.models import Base
import socket

# Force IPv4 resolution for Supabase direct connections
# Render's network may fail to connect over IPv6 to Supabase
_original_getaddrinfo = socket.getaddrinfo

def _ipv4_preferred_getaddrinfo(*args, **kwargs):
    """Prefer IPv4 addresses for Supabase connections (workaround for Render)."""
    responses = _original_getaddrinfo(*args, **kwargs)
    ipv4 = [r for r in responses if r[0] == socket.AF_INET]
    return ipv4 if ipv4 else responses

if "supabase.co" in settings.DATABASE_URL:
    socket.getaddrinfo = _ipv4_preferred_getaddrinfo

# SQLAlchemy Engine using psycopg (v3) driver with direct Supabase connection
db_url = settings.DATABASE_URL

# Ensure SQLAlchemy uses the psycopg (v3) driver
# Convert: postgresql:// → postgresql+psycopg://
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)

engine = create_engine(
    db_url,
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

