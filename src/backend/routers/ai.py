from fastapi import APIRouter, HTTPException
import json
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import AIRequest
from config.ai_config import AIConfig

router = APIRouter()

@router.post("/ai/generate")
async def generate_diagram(request: AIRequest):
    from app import http_client
    
    config = AIConfig()
    
    if request.mode == "create":
        user_message = f"Create a {request.diagram_type} diagram for: {request.prompt}"
    else:
        user_message = f"Modify this {request.diagram_type} diagram:\n``````\n\nChanges requested: {request.prompt}"
    
    payload = {
        "model": config.LM_STUDIO_MODEL,
        "messages": [
            {"role": "system", "content": config.get_system_prompt(request.diagram_type)},
            {"role": "user", "content": user_message}
        ],
        "stream": False,
        "max_tokens": config.MAX_TOKENS,
        "temperature": config.TEMPERATURE,
        "top_p": config.TOP_P,
        "stop": config.STOP_SEQUENCES
    }
    
    try:
        response = await http_client.post(
            f"{config.LM_STUDIO_URL}/v1/chat/completions",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"LM Studio error: {response.status_code}"
            )
        
        response_data = response.json()
        
        if "choices" in response_data and response_data["choices"]:
            content = response_data["choices"][0]["message"]["content"]
            return {"content": content}
        else:
            raise HTTPException(status_code=500, detail="No content generated")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
