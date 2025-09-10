# src\backend\app\routes\workspace.py

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.models.workspace import (
    WorkspaceCreate, WorkspaceResponse, WorkspaceGeneration, 
    WorkspaceModification, WorkspaceSave
)
from app.services.workspace_service import workspace_service
from app.utils.prompt_templates import get_available_diagram_types
from app.core.security import verify_token
from app.core.database import get_redis, get_database
from app.core.config import settings

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

@router.post("/", response_model=WorkspaceResponse)
async def create_workspace(
    workspace_data: WorkspaceCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create or load workspace"""
    print(f"Creating workspace for user {user_id}, diagram: {workspace_data.diagram_id}")
    
    try:
        workspace = await workspace_service.create_workspace(user_id, workspace_data.diagram_id)
        return WorkspaceResponse(**workspace)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.get("/{diagram_id}", response_model=WorkspaceResponse)
async def get_workspace(
    diagram_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get workspace for specific diagram"""
    print(f"Getting workspace for diagram {diagram_id}, user {user_id}")
    
    workspace = await workspace_service.get_workspace(user_id, diagram_id)
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workspace not found"
        )
    
    return WorkspaceResponse(**workspace)

@router.get("/", response_model=WorkspaceResponse)
async def get_new_workspace(
    user_id: str = Depends(get_current_user_id)
):
    """Get new workspace"""
    print(f"Getting new workspace for user {user_id}")
    
    workspace = await workspace_service.get_workspace(user_id, None)
    return WorkspaceResponse(**workspace)

@router.post("/{diagram_id}/generate", response_model=WorkspaceResponse)
async def generate_in_workspace(
    diagram_id: str,
    generation_data: WorkspaceGeneration,
    user_id: str = Depends(get_current_user_id)
):
    """Generate diagram in workspace"""
    print(f"Generating in workspace {diagram_id} for user {user_id}, model: {generation_data.model}")
    
    # Validate diagram type
    if generation_data.diagram_type not in get_available_diagram_types():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid diagram type. Available: {get_available_diagram_types()}"
        )
    
    # Validate model if provided
    if generation_data.model and generation_data.model not in settings.available_models:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid model. Available: {settings.available_models}"
        )
    
    try:
        workspace = await workspace_service.generate_in_workspace(
            user_id=user_id,
            diagram_id=diagram_id if diagram_id != "new" else None,
            prompt=generation_data.prompt,
            diagram_type=generation_data.diagram_type,
            model=generation_data.model  # Передаем выбранную модель
        )
        return WorkspaceResponse(**workspace)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/generate", response_model=WorkspaceResponse)
async def generate_in_new_workspace(
    generation_data: WorkspaceGeneration,
    user_id: str = Depends(get_current_user_id)
):
    """Generate diagram in new workspace"""
    print(f"Generating in new workspace for user {user_id}, model: {generation_data.model}")
    
    # Validate diagram type
    if generation_data.diagram_type not in get_available_diagram_types():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid diagram type. Available: {get_available_diagram_types()}"
        )
    
    # Validate model if provided
    if generation_data.model and generation_data.model not in settings.available_models:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid model. Available: {settings.available_models}"
        )
    
    try:
        workspace = await workspace_service.generate_in_workspace(
            user_id=user_id,
            diagram_id=None,
            prompt=generation_data.prompt,
            diagram_type=generation_data.diagram_type,
            model=generation_data.model  # Передаем выбранную модель
        )
        return WorkspaceResponse(**workspace)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/{diagram_id}/modify", response_model=WorkspaceResponse)
async def modify_in_workspace(
    diagram_id: str,
    modification_data: WorkspaceModification,
    user_id: str = Depends(get_current_user_id)
):
    """Modify diagram in workspace"""
    print(f"Modifying workspace {diagram_id} for user {user_id}, model: {modification_data.model}")
    
    # Validate model if provided
    if modification_data.model and modification_data.model not in settings.available_models:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid model. Available: {settings.available_models}"
        )
    
    try:
        workspace = await workspace_service.modify_in_workspace(
            user_id=user_id,
            diagram_id=diagram_id,
            modification_prompt=modification_data.modification_prompt,
            model=modification_data.model  # Передаем выбранную модель
        )
        return WorkspaceResponse(**workspace)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
@router.post("/{diagram_id}/save")
async def save_workspace(
    diagram_id: str,
    save_data: WorkspaceSave,
    user_id: str = Depends(get_current_user_id)
):
    """Save workspace to database"""
    print(f"Saving workspace {diagram_id} for user {user_id}")
    
    try:
        saved_id = await workspace_service.save_workspace(
            user_id=user_id,
            diagram_id=diagram_id if diagram_id != "new" else None,
            title=save_data.title,
            description=save_data.description
        )
        return {"message": "Workspace saved", "diagram_id": saved_id}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/save")
async def save_new_workspace(
    save_data: WorkspaceSave,
    user_id: str = Depends(get_current_user_id)
):
    """Save new workspace to database"""
    print(f"Saving new workspace for user {user_id}")
    
    try:
        saved_id = await workspace_service.save_workspace(
            user_id=user_id,
            diagram_id=None,
            title=save_data.title,
            description=save_data.description
        )
        return {"message": "Workspace saved", "diagram_id": saved_id}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

