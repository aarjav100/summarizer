from fastapi import APIRouter
from typing import List
from app.schemas.schemas import LLMModelInfo
from app.services.llm.provider import LLMProviderService

router = APIRouter(prefix="/models", tags=["Models"])

@router.get("", response_model=List[LLMModelInfo])
def get_available_models():
    return LLMProviderService.get_supported_models()
