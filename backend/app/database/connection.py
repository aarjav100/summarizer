from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
from app.database.models import Base
from urllib.parse import urlparse
import socket

# SQLAlchemy Engine using psycopg (v3) driver with direct Supabase connection
db_url = settings.DATABASE_URL

# Ensure SQLAlchemy uses the psycopg (v3) driver
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)

# Force IPv4 for Supabase connections — Render cannot reach Supabase over IPv6.
# We resolve the hostname to an IPv4 address and pass it as libpq's 'hostaddr',
# which forces the TCP connection over IPv4. The original hostname stays in the
# URL for SSL certificate validation.
connect_args = {}
parsed = urlparse(settings.DATABASE_URL)
hostname = parsed.hostname

if hostname and "supabase.co" in hostname:
    try:
        ipv4_results = socket.getaddrinfo(hostname, parsed.port or 5432, socket.AF_INET)
        if ipv4_results:
            ipv4_addr = ipv4_results[0][4][0]
            connect_args["hostaddr"] = ipv4_addr
            print(f"Resolved {hostname} → {ipv4_addr} (forced IPv4)")
    except Exception as e:
        print(f"IPv4 resolution failed for {hostname}: {e}")

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


