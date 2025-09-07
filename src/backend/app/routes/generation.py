from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.services.generation_service import generation_service
from app.utils.prompt_templates import get_available_diagram_types
from app.core.security import verify_token
from app.core.database import get_redis, get_database

router = APIRouter()
security = HTTPBearer()

class GenerationRequest(BaseModel):
    prompt: str
    diagram_type: str = "flowchart"

class GenerationResponse(BaseModel):
    mermaid_code: str
    original_prompt: str
    diagram_type: str
    is_valid: bool
    validation_error: Optional[str] = None

class ModificationRequest(BaseModel):
    diagram_id: str
    modification_prompt: str

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current authenticated user ID"""
    token = credentials.credentials
    username = verify_token(token)
    
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    redis = get_redis()
    session_username = await redis.get(f"token:{token}")
    if not session_username or session_username.decode() != username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid"
        )
    
    db = get_database()
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return str(user["_id"])

@router.get("/test")
async def test_llm_connection():
    """Test LM Studio connection"""
    from app.services.llm_service import llm_service
    is_connected = await llm_service.test_connection()
    
    return {
        "llm_connected": is_connected,
        "llm_url": llm_service.base_url,
        "model": llm_service.model
    }

@router.get("/types")
async def get_diagram_types():
    """Get available diagram types"""
    return {
        "types": get_available_diagram_types(),
        "default": "flowchart"
    }

@router.post("/", response_model=GenerationResponse)
async def generate_diagram(
    request: GenerationRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Generate diagram with advanced prompt templates"""
    print(f"Generation request from user {user_id}: {request.diagram_type}")
    
    # Validate diagram type
    if request.diagram_type not in get_available_diagram_types():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid diagram type. Available: {get_available_diagram_types()}"
        )
    
    result, error = await generation_service.generate_and_log(
        user_id=user_id,
        prompt=request.prompt,
        diagram_type=request.diagram_type
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error or "Failed to generate diagram"
        )
    
    return GenerationResponse(
        mermaid_code=result,
        original_prompt=request.prompt,
        diagram_type=request.diagram_type,
        is_valid=error is None,
        validation_error=error
    )

@router.post("/modify", response_model=GenerationResponse)
async def modify_diagram(
    request: ModificationRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Modify existing diagram"""
    print(f"Modification request from user {user_id} for diagram {request.diagram_id}")
    
    result, error = await generation_service.modify_diagram(
        user_id=user_id,
        diagram_id=request.diagram_id,
        modification_prompt=request.modification_prompt
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error or "Failed to modify diagram"
        )
    
    return GenerationResponse(
        mermaid_code=result,
        original_prompt=request.modification_prompt,
        diagram_type="unknown",
        is_valid=error is None,
        validation_error=error
    )

@router.get("/history")
async def get_generation_history(
    user_id: str = Depends(get_current_user_id),
    limit: int = 10
):
    """Get user's generation history"""
    history = await generation_service.get_user_generation_history(user_id, limit)
    return {"history": history, "count": len(history)}
