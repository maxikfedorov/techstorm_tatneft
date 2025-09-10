from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DiagramBase(BaseModel):
    title: str
    description: Optional[str] = None
    diagram_type: str
    mermaid_code: str

class DiagramCreate(DiagramBase):
    pass

class DiagramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    mermaid_code: Optional[str] = None

class DiagramInDB(DiagramBase):
    id: str
    user_id: str
    original_prompt: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class DiagramResponse(DiagramBase):
    id: str
    original_prompt: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class DiagramListItem(BaseModel):
    id: str
    title: str
    diagram_type: str
    created_at: datetime
    updated_at: datetime
