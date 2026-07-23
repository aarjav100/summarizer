from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
from app.database.models import Base

# SQLAlchemy Engine
# Note: DATABASE_URL should be set in .env
connect_args = {}
if "supabase.com" in settings.DATABASE_URL or "pooler" in settings.DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(
    settings.DATABASE_URL,
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
