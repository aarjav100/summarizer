from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    clerk_id: str

class UserResponse(UserBase):
    id: str
    clerk_id: str
    role: str
    plan: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Project Schemas
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# File Item Schemas
class FileUploadRequest(BaseModel):
    project_id: str
    file_type: str # 'pdf', 'image', 'video', 'audio', 'url', 'text'
    source_url: Optional[str] = None
    text_content: Optional[str] = None

class FileItemResponse(BaseModel):
    id: str
    project_id: str
    filename: str
    file_type: str
    file_size_bytes: int
    storage_url: Optional[str]
    source_url: Optional[str]
    status: str
    is_favorite: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Multi-LLM Provider & Selection Schemas
class LLMModelInfo(BaseModel):
    id: str
    name: str
    provider: str # 'OpenAI', 'Gemini', 'Claude', 'OpenRouter', 'DeepSeek', 'Grok', 'Mistral', 'Cohere', 'Ollama'
    description: str
    max_tokens: int
    input_cost_per_1k: float
    output_cost_per_1k: float
    supports_vision: bool = False

class LLMUsageMetrics(BaseModel):
    model_name: str
    provider: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    response_time_ms: float
    estimated_cost_usd: float

# Summary Request & Response
class SummaryRequest(BaseModel):
    file_id: str
    summary_types: List[str] # ['short', 'medium', 'detailed', 'bullet', 'takeaways', 'facts', 'action_items', 'faq', 'timeline', 'chapters', 'mcq', 'definitions', 'formulae']
    model_id: Optional[str] = "gpt-4o"
    custom_prompt: Optional[str] = None

class SummaryItemResponse(BaseModel):
    summary_type: str
    title: str
    content: str

class SummaryResponse(BaseModel):
    file_id: str
    summaries: List[SummaryItemResponse]
    metrics: LLMUsageMetrics

# Chat & Citation Schemas
class Citation(BaseModel):
    chunk_id: str
    page_number: Optional[int] = None
    timestamp_seconds: Optional[float] = None
    source_text: str

class ChatMessageCreate(BaseModel):
    chat_id: str
    message: str
    model_id: Optional[str] = "gpt-4o"
    file_id: Optional[str] = None
    use_full_context: Optional[bool] = False

class ChatMessageResponse(BaseModel):
    id: str
    sender: str
    content: str
    citations: Optional[List[Citation]] = None
    model_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
