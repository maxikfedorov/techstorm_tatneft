# src/backend/app/services/workspace_service.py
from datetime import datetime
from typing import Optional, Dict, List
from app.core.database import get_database
from app.services.diagram_service import diagram_service
from app.services.generation_service import generation_service
from app.models.diagram import DiagramCreate
from app.core.config import settings
from bson import ObjectId


class WorkspaceService:
    
    def __init__(self):
        self.active_workspaces: Dict[str, dict] = {}  # In-memory workspace state
    
    async def create_workspace(self, user_id: str, diagram_id: Optional[str] = None) -> dict:
        """Create or load workspace"""
        
        if diagram_id:
            # Load existing diagram
            diagram = await diagram_service.get_diagram(user_id, diagram_id)
            if not diagram:
                raise ValueError("Diagram not found")
            
            workspace_data = {
                "diagram_id": diagram.id,
                "title": diagram.title,
                "diagram_type": diagram.diagram_type,
                "current_prompt": diagram.original_prompt or "",
                "mermaid_code": diagram.mermaid_code,
                "has_unsaved_changes": False,
                "generation_history": [],
                "created_at": datetime.utcnow()
            }
            
            print(f"Loaded diagram {diagram_id} into workspace for user {user_id}")
        else:
            # Create new workspace
            workspace_data = {
                "diagram_id": None,
                "title": "Новая диаграмма",
                "diagram_type": "flowchart",
                "current_prompt": "",
                "mermaid_code": "",
                "has_unsaved_changes": False,
                "generation_history": [],
                "created_at": datetime.utcnow()
            }
            
            print(f"Created new workspace for user {user_id}")
        
        # Store in memory (in production, use Redis)
        workspace_key = f"{user_id}:{diagram_id or 'new'}"
        self.active_workspaces[workspace_key] = workspace_data
        
        return workspace_data
    
    async def get_workspace(self, user_id: str, diagram_id: Optional[str] = None) -> Optional[dict]:
        """Get workspace state"""
        workspace_key = f"{user_id}:{diagram_id or 'new'}"
        
        if workspace_key not in self.active_workspaces:
            # Try to create/load workspace
            try:
                return await self.create_workspace(user_id, diagram_id)
            except ValueError:
                return None
        
        return self.active_workspaces[workspace_key]
    
    async def update_workspace(self, user_id: str, diagram_id: Optional[str], updates: dict) -> dict:
        """Update workspace state"""
        workspace_key = f"{user_id}:{diagram_id or 'new'}"
        
        if workspace_key not in self.active_workspaces:
            await self.create_workspace(user_id, diagram_id)
        
        workspace = self.active_workspaces[workspace_key]
        
        # Update fields
        for key, value in updates.items():
            if key in workspace:
                workspace[key] = value
        
        workspace["has_unsaved_changes"] = True
        
        print(f"Updated workspace for user {user_id}")
        return workspace
    
    async def generate_in_workspace(
        self, 
        user_id: str, 
        diagram_id: Optional[str], 
        prompt: str, 
        diagram_type: str,
        model: Optional[str] = None  # Добавляем параметр модели
    ) -> dict:
        """Generate diagram in workspace context"""
        
        # Используем переданную модель или дефолтную
        selected_model = model or settings.default_model
        print(f"Generating in workspace with model: {selected_model}")
        
        result, error = await generation_service.generate_and_log(
            user_id=user_id,
            prompt=prompt,
            diagram_type=diagram_type,
            diagram_id=diagram_id,
            model=selected_model  # Передаем выбранную модель
        )
        
        if not result:
            raise ValueError(error or "Generation failed")
        
        # Update workspace
        updates = {
            "current_prompt": prompt,
            "diagram_type": diagram_type,
            "mermaid_code": result,
            "has_unsaved_changes": True
        }
        
        workspace = await self.update_workspace(user_id, diagram_id, updates)
        
        # Add to generation history
        generation_entry = {
            "prompt": prompt,
            "diagram_type": diagram_type,
            "model": selected_model,  # Добавляем модель в историю
            "code": result,
            "timestamp": datetime.utcnow().isoformat(),
            "is_valid": error is None
        }
        
        workspace["generation_history"].append(generation_entry)
        
        print(f"Generated diagram in workspace for user {user_id} with {selected_model}")
        return workspace
    
    async def modify_in_workspace(
        self, 
        user_id: str, 
        diagram_id: str, 
        modification_prompt: str,
        model: Optional[str] = None  # Добавляем параметр модели
    ) -> dict:
        """Modify diagram in workspace context"""
        
        selected_model = model or settings.default_model
        print(f"Workspace modification: user {user_id}, diagram {diagram_id}, model: {selected_model}")
        
        if not diagram_id or diagram_id == "new":
            raise ValueError("Cannot modify diagram: invalid diagram ID")
        
        try:
            result, error = await generation_service.modify_diagram(
                user_id=user_id,
                diagram_id=diagram_id,
                modification_prompt=modification_prompt,
                model=selected_model  # Передаем выбранную модель
            )
            
            print(f"Modification service result: success={result is not None}, error={error}")
            
            if not result:
                raise ValueError(error or "Modification failed")
            
            # Update workspace
            updates = {
                "mermaid_code": result,
                "has_unsaved_changes": True
            }
            
            workspace = await self.update_workspace(user_id, diagram_id, updates)
            
            # Add to generation history
            modification_entry = {
                "prompt": f"Modification: {modification_prompt}",
                "diagram_type": workspace["diagram_type"],
                "model": selected_model,  # Добавляем модель в историю
                "code": result,
                "timestamp": datetime.utcnow().isoformat(),
                "is_modification": True
            }
            
            workspace["generation_history"].append(modification_entry)
            
            print(f"Modified diagram in workspace for user {user_id} with {selected_model}")
            return workspace
            
        except Exception as e:
            print(f"Workspace modification error: {e}")
            raise ValueError(f"Modification failed: {str(e)}")

    async def save_workspace(self, user_id: str, diagram_id: Optional[str], title: str, description: Optional[str] = None) -> str:
        """Save workspace to database"""
        
        workspace = await self.get_workspace(user_id, diagram_id)
        if not workspace:
            raise ValueError("Workspace not found")
        
        if workspace["diagram_id"]:
            # Update existing diagram
            from app.models.diagram import DiagramUpdate
            update_data = DiagramUpdate(
                title=title,
                description=description,
                mermaid_code=workspace["mermaid_code"]
            )
            
            updated_diagram = await diagram_service.update_diagram(
                user_id=user_id,
                diagram_id=workspace["diagram_id"],
                update_data=update_data
            )
            
            if not updated_diagram:
                raise ValueError("Failed to update diagram")
            
            saved_id = updated_diagram.id
        else:
            # Create new diagram
            diagram_data = DiagramCreate(
                title=title,
                description=description,
                diagram_type=workspace["diagram_type"],
                mermaid_code=workspace["mermaid_code"]
            )
            
            new_diagram = await diagram_service.create_diagram(
                user_id=user_id,
                diagram_data=diagram_data,
                original_prompt=workspace["current_prompt"]
            )
            
            saved_id = new_diagram.id
            
            # Update workspace with new diagram ID
            workspace["diagram_id"] = saved_id
        
        # Mark as saved
        workspace["has_unsaved_changes"] = False
        workspace["title"] = title
        
        print(f"Saved workspace to diagram {saved_id}")
        return saved_id


workspace_service = WorkspaceService()
