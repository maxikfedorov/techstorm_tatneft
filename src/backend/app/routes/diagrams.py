from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from app.models.diagram import DiagramCreate, DiagramUpdate, DiagramResponse, DiagramListItem
from app.services.diagram_service import diagram_service
from app.core.security import verify_token
from app.core.database import get_redis, get_database

router = APIRouter()
security = HTTPBearer()

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

@router.get("/", response_model=List[DiagramListItem])
async def get_diagrams(
    user_id: str = Depends(get_current_user_id),
    limit: int = 50
):
    """Get user's diagrams list"""
    print(f"Getting diagrams for user {user_id}")
    diagrams = await diagram_service.get_user_diagrams(user_id, limit)
    return diagrams

@router.post("/", response_model=DiagramResponse)
async def create_diagram(
    diagram_data: DiagramCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create new diagram"""
    print(f"Creating diagram: {diagram_data.title} for user {user_id}")
    
    diagram = await diagram_service.create_diagram(user_id, diagram_data)
    
    return DiagramResponse(
        id=diagram.id,
        title=diagram.title,
        description=diagram.description,
        diagram_type=diagram.diagram_type,
        mermaid_code=diagram.mermaid_code,
        original_prompt=diagram.original_prompt,
        created_at=diagram.created_at,
        updated_at=diagram.updated_at
    )

@router.get("/{diagram_id}", response_model=DiagramResponse)
async def get_diagram(
    diagram_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get specific diagram"""
    print(f"Getting diagram {diagram_id} for user {user_id}")
    
    diagram = await diagram_service.get_diagram(user_id, diagram_id)
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return DiagramResponse(
        id=diagram.id,
        title=diagram.title,
        description=diagram.description,
        diagram_type=diagram.diagram_type,
        mermaid_code=diagram.mermaid_code,
        original_prompt=diagram.original_prompt,
        created_at=diagram.created_at,
        updated_at=diagram.updated_at
    )

@router.put("/{diagram_id}", response_model=DiagramResponse)
async def update_diagram(
    diagram_id: str,
    update_data: DiagramUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """Update diagram"""
    print(f"Updating diagram {diagram_id} for user {user_id}")
    
    diagram = await diagram_service.update_diagram(user_id, diagram_id, update_data)
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return DiagramResponse(
        id=diagram.id,
        title=diagram.title,
        description=diagram.description,
        diagram_type=diagram.diagram_type,
        mermaid_code=diagram.mermaid_code,
        original_prompt=diagram.original_prompt,
        created_at=diagram.created_at,
        updated_at=diagram.updated_at
    )

@router.delete("/{diagram_id}")
async def delete_diagram(
    diagram_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete diagram"""
    print(f"Deleting diagram {diagram_id} for user {user_id}")
    
    success = await diagram_service.delete_diagram(user_id, diagram_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return {"message": "Diagram deleted successfully"}

@router.get("/stats/summary")
async def get_diagram_stats(
    user_id: str = Depends(get_current_user_id)
):
    """Get user's diagram statistics"""
    stats = await diagram_service.get_diagram_stats(user_id)
    return stats
