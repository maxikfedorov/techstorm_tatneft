from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class WorkspaceCreate(BaseModel):
    diagram_id: Optional[str] = None  # None для новой диаграммы

class WorkspaceResponse(BaseModel):
    diagram_id: Optional[str]
    title: str
    diagram_type: str
    current_prompt: Optional[str]
    mermaid_code: str
    has_unsaved_changes: bool
    generation_history: List[dict]

class WorkspaceGeneration(BaseModel):
    prompt: str
    diagram_type: str = "flowchart"

class WorkspaceModification(BaseModel):
    modification_prompt: str

class WorkspaceSave(BaseModel):
    title: str
    description: Optional[str] = None

