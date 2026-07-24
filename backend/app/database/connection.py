from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
from app.database.models import Base

# SQLAlchemy Engine using psycopg (v3) driver
# psycopg v3 natively supports SNI which is required by Supabase Supavisor pooler
db_url = settings.DATABASE_URL

# Ensure SQLAlchemy uses the psycopg (v3) driver, not psycopg2
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

