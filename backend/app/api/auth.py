from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from app.schemas.schemas import UserResponse
from datetime import datetime
from jose import jwt
import httpx
from app.config.settings import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

# Cache JWKS key queries to optimize latency
_jwks_cache = None

def get_jwks_keys():
    global _jwks_cache
    if not _jwks_cache:
        issuer = settings.CLERK_JWT_ISSUER or "https://evolving-squirrel-89.clerk.accounts.dev"
        try:
            r = httpx.get(f"{issuer}/.well-known/jwks.json")
            if r.status_code == 200:
                _jwks_cache = r.json()
        except Exception as e:
            print(f"Warning: Failed to fetch JWKS from Clerk issuer: {e}")
    return _jwks_cache

def verify_clerk_token(authorization: Optional[str] = Header(None)) -> dict:
    """FastAPI Dependency that extracts and decodes Clerk JWT Token verification."""
    if not authorization or not authorization.startswith("Bearer "):
        # Dev fallback: if no key is configured, allow mock demo user credentials
        if not settings.CLERK_SECRET_KEY:
            return {
                "sub": "user_clerk_9999",
                "email": "user@summarizer.ai",
                "name": "Alex Mercer"
            }
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header scheme.")
        
    token = authorization.split(" ")[1]
    jwks = get_jwks_keys()
    
    if not jwks:
        if not settings.CLERK_SECRET_KEY:
            return {
                "sub": "user_clerk_9999",
                "email": "user@summarizer.ai",
                "name": "Alex Mercer"
            }
        raise HTTPException(status_code=401, detail="Failed to load Clerk token verification keys.")
        
    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks.get("keys", []):
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
                
        if rsa_key:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=settings.CLERK_PUBLISHABLE_KEY or "pk_test_ZXZvbHZpbmctc3F1aXJyZWwtODkuY2xlcmsuYWNjb3VudHMuZGV2JA",
                issuer=settings.CLERK_JWT_ISSUER or "https://evolving-squirrel-89.clerk.accounts.dev"
            )
            return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")
        
    raise HTTPException(status_code=401, detail="Unable to verify token credentials.")

@router.get("/me", response_model=UserResponse)
def get_current_user(payload: dict = Depends(verify_clerk_token)):
    """Verifies Clerk JWT header and returns current user info."""
    return UserResponse(
        id=f"usr_{payload.get('sub', 'demo')[:10]}",
        clerk_id=payload.get("sub", "user_clerk_9999"),
        email=payload.get("email", "user@summarizer.ai"),
        full_name=payload.get("name", "Alex Mercer"),
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        role="user",
        plan="pro",
        created_at=datetime.utcnow()
    )
