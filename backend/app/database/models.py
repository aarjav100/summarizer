import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.orm import declarative_base, relationship
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="user")  # 'user', 'admin'
    plan = Column(String, default="free")  # 'free', 'pro', 'enterprise'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="projects")
    files = relationship("FileItem", back_populates="project", cascade="all, delete-orphan")
    chats = relationship("ChatSession", back_populates="project", cascade="all, delete-orphan")

class FileItem(Base):
    __tablename__ = "files"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # 'pdf', 'image', 'video', 'audio', 'url', 'text'
    file_size_bytes = Column(Integer, default=0)
    storage_url = Column(Text, nullable=True)
    source_url = Column(Text, nullable=True)     # For URL scraping / YouTube
    ocr_extracted_text = Column(Text, nullable=True)
    status = Column(String, default="pending")   # 'pending', 'processing', 'completed', 'failed'
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="files")
    chunks = relationship("DocumentChunk", back_populates="file", cascade="all, delete-orphan")
    summaries = relationship("SummaryResult", back_populates="file", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    file_id = Column(String, ForeignKey("files.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)       # For PDFs
    timestamp_seconds = Column(Float, nullable=True)    # For Audio/Video transcripts
    embedding = Column(Vector(1536), nullable=True)      # OpenAI 1536-dim vector embedding
    created_at = Column(DateTime, default=datetime.utcnow)
    
    file = relationship("FileItem", back_populates="chunks")

class SummaryResult(Base):
    __tablename__ = "summary_results"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    file_id = Column(String, ForeignKey("files.id"), nullable=False)
    summary_type = Column(String, nullable=False) # 'short', 'medium', 'detailed', 'bullet', 'takeaways', 'facts', 'action_items', 'faq', 'timeline', 'chapters', 'mcq', 'definitions', 'formulae'
    content = Column(Text, nullable=False)
    model_name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    response_time_ms = Column(Float, default=0.0)
    estimated_cost_usd = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    file = relationship("FileItem", back_populates="summaries")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    file_id = Column(String, ForeignKey("files.id"), nullable=True)
    title = Column(String, nullable=False, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="chats")
    messages = relationship("ChatMessage", back_populates="chat", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    sender = Column(String, nullable=False)  # 'user', 'assistant'
    content = Column(Text, nullable=False)
    citations = Column(JSON, nullable=True)  # List of [{chunk_id, page_number, timestamp_seconds, source_text}]
    model_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    chat = relationship("ChatSession", back_populates="messages")
