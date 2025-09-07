# src\backend\app\models\generation.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GenerationLog(BaseModel):
    id: Optional[str] = None
    user_id: str
    diagram_id: Optional[str] = None
    prompt: str
    diagram_type: str
    generated_code: str
    is_valid: bool
    error_message: Optional[str] = None
    generation_time: float
    created_at: datetime

class ModificationRequest(BaseModel):
    diagram_id: str
    modification_prompt: str

class ModificationResponse(BaseModel):
    mermaid_code: str
    original_prompt: str
    modification_prompt: str
    diagram_type: str

