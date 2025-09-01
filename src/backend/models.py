# src/backend/models.py
from pydantic import BaseModel
from typing import Optional

class DiagramRequest(BaseModel):
    code: str

class AIRequest(BaseModel):
    prompt: str
    current_code: Optional[str] = None
    diagram_type: str = "flowchart"
    mode: str = "create"
    
class DiagramResponse(BaseModel):
    valid: bool
    error: str = ""

class AIResponse(BaseModel):
    code: str
    explanation: str = ""
