from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.schemas import ProjectCreate, ProjectResponse
from datetime import datetime
import uuid

router = APIRouter(prefix="/projects", tags=["Projects"])

MOCK_PROJECTS = [
    ProjectResponse(id="proj-1", name="AI Engineering Research", description="RAG and LLM Paper Summaries", created_at=datetime.utcnow()),
    ProjectResponse(id="proj-2", name="Financial Audits 2026", description="Quarterly Invoices and Reports", created_at=datetime.utcnow()),
    ProjectResponse(id="proj-3", name="Video Lecture Notes", description="YouTube Transcripts and Study Guides", created_at=datetime.utcnow())
]

@router.get("", response_model=List[ProjectResponse])
def list_projects():
    return MOCK_PROJECTS

@router.post("", response_model=ProjectResponse)
def create_project(payload: ProjectCreate):
    new_proj = ProjectResponse(
        id=f"proj-{uuid.uuid4().hex[:6]}",
        name=payload.name,
        description=payload.description,
        created_at=datetime.utcnow()
    )
    MOCK_PROJECTS.append(new_proj)
    return new_proj
