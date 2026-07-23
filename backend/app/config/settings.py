import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multimodal AI Summarizer SaaS"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENV: str = "production"
    DEBUG: bool = False
    
    # Security & CORS
    SECRET_KEY: str = "super-secret-key-change-in-production-123456789"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://summarizer.ai",
        "https://*.vercel.app",
        "https://summamind.shop",
        "https://www.summamind.shop"
    ]
    
    # Clerk Authentication
    CLERK_SECRET_KEY: Optional[str] = None
    CLERK_PUBLISHABLE_KEY: Optional[str] = None
    CLERK_JWT_ISSUER: Optional[str] = None
    
    # Supabase / Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/summarizer"
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Model Providers Keys
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    OPENROUTER_API_KEY: Optional[str] = None
    DEEPSEEK_API_KEY: Optional[str] = None
    GROK_API_KEY: Optional[str] = None
    MISTRAL_API_KEY: Optional[str] = None
    COHERE_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    # File Storage
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_MIME_TYPES: List[str] = [
        "application/pdf",
        "image/png", "image/jpeg", "image/webp", "image/gif",
        "audio/mpeg", "audio/wav", "audio/x-m4a", "audio/mp3",
        "video/mp4", "video/webm", "text/plain"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Dynamically rewrite direct Supabase host to use Connection Pooler and enforce SSL (SNI)
# This resolves psycopg2 operational connection failures (IPv6 unreachable and ENOIDENTIFIER on Render)
if "db.fyriayifjvgqjpzfwsvm.supabase.co" in settings.DATABASE_URL:
    settings.DATABASE_URL = settings.DATABASE_URL.replace(
        "db.fyriayifjvgqjpzfwsvm.supabase.co", 
        "aws-0-ap-northeast-1.pooler.supabase.com"
    ).replace(":5432", ":6543")

if "pooler.supabase.com" in settings.DATABASE_URL and "sslmode" not in settings.DATABASE_URL:
    separator = "&" if "?" in settings.DATABASE_URL else "?"
    settings.DATABASE_URL += f"{separator}sslmode=require"
