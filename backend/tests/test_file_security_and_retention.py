import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import sys
import os
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, backend_dir)

from app.main import app
from app.database.connection import get_db
from app.database.models import Base, User, Project, FileItem, DocumentChunk

# Setup in-memory SQLite database for security tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Helper token headers for User A and User B
USER_A_TOKEN = "Bearer demo_user_a_token"
USER_B_TOKEN = "Bearer demo_user_b_token"

@pytest.fixture(autouse=True)
def setup_test_users_and_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    user_a = User(id="usr_user_a", clerk_id="clerk_user_a", email="usera@test.com", full_name="User A")
    user_b = User(id="usr_user_b", clerk_id="clerk_user_b", email="userb@test.com", full_name="User B")
    db.add_all([user_a, user_b])
    
    proj_a = Project(id="proj-user-a", user_id="usr_user_a", name="User A Project")
    proj_b = Project(id="proj-user-b", user_id="usr_user_b", name="User B Project")
    db.add_all([proj_a, proj_b])
    db.commit()
    db.close()

from fastapi import Header
from typing import Optional
from app.api import auth

def mock_verify_clerk_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header scheme.")
    
    token = authorization.split(" ")[1]
    if "user_a" in token:
        return {"sub": "clerk_user_a", "email": "usera@test.com", "name": "User A"}
    elif "user_b" in token:
        return {"sub": "clerk_user_b", "email": "userb@test.com", "name": "User B"}
    else:
        return {"sub": "clerk_user_a", "email": "usera@test.com", "name": "User A"}

app.dependency_overrides[auth.verify_clerk_token] = mock_verify_clerk_token



def test_unauthenticated_request_rejected():
    """Confirms unauthenticated requests without authorization header are rejected with 401."""
    res_list = client.get("/api/v1/files")
    assert res_list.status_code == 401

    res_get = client.get("/api/v1/files/file-101")
    assert res_get.status_code == 401

    res_sum = client.post("/api/v1/summarize", json={"file_id": "file-101", "summary_types": ["short"]})
    assert res_sum.status_code == 401


def test_user_ownership_isolation():
    """Confirms User A cannot access User B's uploaded file, and vice versa."""
    # 1. User A uploads a PDF file
    upload_res = client.post(
        "/api/v1/files/upload",
        data={"project_id": "proj-user-a", "file_type": "pdf", "is_single_use": "false"},
        files={"file": ("confidential_report_a.pdf", b"Confidential content for User A", "application/pdf")},
        headers={"Authorization": USER_A_TOKEN}
    )
    assert upload_res.status_code == 200
    file_id_a = upload_res.json()["id"]

    # 2. User A can retrieve their uploaded file
    get_res_a = client.get(f"/api/v1/files/{file_id_a}", headers={"Authorization": USER_A_TOKEN})
    assert get_res_a.status_code == 200
    assert get_res_a.json()["filename"] == "confidential_report_a.pdf"

    # 3. User B attempts to access User A's file via GET /files/{id} -> Rejected with 404 Not Found
    get_res_b = client.get(f"/api/v1/files/{file_id_a}", headers={"Authorization": USER_B_TOKEN})
    assert get_res_b.status_code == 404

    # 4. User B attempts to summarize User A's file -> Rejected with 404 Not Found
    sum_res_b = client.post(
        "/api/v1/summarize",
        json={"file_id": file_id_a, "summary_types": ["short"]},
        headers={"Authorization": USER_B_TOKEN}
    )
    assert sum_res_b.status_code == 404

    # 5. User B attempts to chat with User A's file -> Rejected with 404 Not Found
    chat_res_b = client.post(
        "/api/v1/chat",
        json={"chat_id": "chat-test-123", "file_id": file_id_a, "message": "What is in this document?"},
        headers={"Authorization": USER_B_TOKEN}
    )
    assert chat_res_b.status_code == 404


def test_single_use_auto_deletion():
    """Confirms single-use file is immediately deleted post-synthesis and subsequent requests return 404."""
    # 1. User A uploads a single-use file (is_single_use=true)
    upload_res = client.post(
        "/api/v1/files/upload",
        data={"project_id": "proj-user-a", "file_type": "pdf", "is_single_use": "true"},
        files={"file": ("single_use_doc.pdf", b"Temporary invoice details", "application/pdf")},
        headers={"Authorization": USER_A_TOKEN}
    )
    assert upload_res.status_code == 200
    file_id = upload_res.json()["id"]

    # 2. Generate summary for single-use file
    sum_res = client.post(
        "/api/v1/summarize",
        json={"file_id": file_id, "summary_types": ["short"]},
        headers={"Authorization": USER_A_TOKEN}
    )
    assert sum_res.status_code == 200
    assert len(sum_res.json()["summaries"]) > 0

    # 3. Post-synthesis check: verify file is purged and subsequent access returns 404
    get_res_after = client.get(f"/api/v1/files/{file_id}", headers={"Authorization": USER_A_TOKEN})
    assert get_res_after.status_code == 404

    # 4. Repeating summarize on deleted file returns 404 Not Found
    sum_res_again = client.post(
        "/api/v1/summarize",
        json={"file_id": file_id, "summary_types": ["short"]},
        headers={"Authorization": USER_A_TOKEN}
    )
    assert sum_res_again.status_code == 404


def test_explicit_file_consumption():
    """Confirms explicit consumption endpoint purges file storage and records immediately."""
    upload_res = client.post(
        "/api/v1/files/upload",
        data={"project_id": "proj-user-a", "file_type": "pdf", "is_single_use": "true"},
        files={"file": ("manual_consume_doc.pdf", b"Sensitive data to consume", "application/pdf")},
        headers={"Authorization": USER_A_TOKEN}
    )
    assert upload_res.status_code == 200
    file_id = upload_res.json()["id"]

    # Consume file explicitly
    consume_res = client.post(f"/api/v1/files/{file_id}/consume", headers={"Authorization": USER_A_TOKEN})
    assert consume_res.status_code == 200
    assert consume_res.json()["status"] == "consumed_and_purged"

    # Subsequent access yields 404
    get_res = client.get(f"/api/v1/files/{file_id}", headers={"Authorization": USER_A_TOKEN})
    assert get_res.status_code == 404
