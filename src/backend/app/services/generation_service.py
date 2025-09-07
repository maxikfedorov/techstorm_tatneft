# src\backend\app\services\generation_service.py

from datetime import datetime
from typing import Optional, Tuple
from app.core.database import get_database
from app.services.llm_service import llm_service
from app.utils.mermaid_validator import validate_mermaid_syntax, clean_mermaid_code
from app.models.generation import GenerationLog
import time

class GenerationService:
    
    async def generate_and_log(
        self, 
        user_id: str, 
        prompt: str, 
        diagram_type: str,
        diagram_id: Optional[str] = None
    ) -> Tuple[Optional[str], Optional[str]]:
        """Generate diagram and log the result"""
        
        start_time = time.time()
        
        # Generate diagram
        result = await llm_service.generate_diagram(prompt, diagram_type)
        
        generation_time = time.time() - start_time
        
        if result:
            # Validate result
            is_valid, error_message = validate_mermaid_syntax(result, diagram_type)
            
            # Log generation
            await self._log_generation(
                user_id=user_id,
                diagram_id=diagram_id,
                prompt=prompt,
                diagram_type=diagram_type,
                generated_code=result,
                is_valid=is_valid,
                error_message=error_message,
                generation_time=generation_time
            )
            
            print(f"Generation completed in {generation_time:.2f}s, valid: {is_valid}")
            return result, error_message
        else:
            # Log failed generation
            await self._log_generation(
                user_id=user_id,
                diagram_id=diagram_id,
                prompt=prompt,
                diagram_type=diagram_type,
                generated_code="",
                is_valid=False,
                error_message="Generation failed",
                generation_time=generation_time
            )
            
            print(f"Generation failed after {generation_time:.2f}s")
            return None, "Generation failed"
    
    async def modify_diagram(
        self, 
        user_id: str, 
        diagram_id: str, 
        modification_prompt: str
    ) -> Tuple[Optional[str], Optional[str]]:
        """Modify existing diagram"""
        
        print(f"Starting modification for user {user_id}, diagram {diagram_id}")
        
        db = get_database()
        
        try:
            from bson import ObjectId
            object_id = ObjectId(diagram_id)
            print(f"ObjectId created: {object_id}")
        except Exception as e:
            print(f"Invalid ObjectId {diagram_id}: {e}")
            return None, f"Invalid diagram ID: {diagram_id}"
        
        # Get original diagram
        diagram = await db.diagrams.find_one({"_id": object_id, "user_id": user_id})
        print(f"Diagram found: {diagram is not None}")
        
        if not diagram:
            print(f"Diagram not found: {diagram_id} for user {user_id}")
            return None, "Diagram not found"
        
        print(f"Original diagram type: {diagram.get('diagram_type')}")
        print(f"Original code length: {len(diagram.get('mermaid_code', ''))}")
        
        # Create modification prompt
        full_prompt = f"""
        Current diagram code:
        {diagram['mermaid_code']}
        
        Modification request: {modification_prompt}
        
        Please modify the above {diagram['diagram_type']} diagram according to the request.
        Return only the modified mermaid code.
        """
        
        print(f"Full prompt length: {len(full_prompt)}")
        
        try:
            result = await self.generate_and_log(
                user_id=user_id,
                prompt=full_prompt,
                diagram_type=diagram['diagram_type'],
                diagram_id=diagram_id
            )
            
            print(f"Modification result: {result[0] is not None}")
            return result
            
        except Exception as e:
            print(f"Modification generation failed: {e}")
            return None, f"Modification failed: {str(e)}"
 
    async def _log_generation(
        self,
        user_id: str,
        diagram_id: Optional[str],
        prompt: str,
        diagram_type: str,
        generated_code: str,
        is_valid: bool,
        error_message: Optional[str],
        generation_time: float
    ):
        """Log generation to database"""
        
        db = get_database()
        
        log_data = {
            "user_id": user_id,
            "diagram_id": diagram_id,
            "prompt": prompt,
            "diagram_type": diagram_type,
            "generated_code": generated_code,
            "is_valid": is_valid,
            "error_message": error_message,
            "generation_time": generation_time,
            "created_at": datetime.utcnow()
        }
        
        await db.generation_logs.insert_one(log_data)
        print(f"Generation logged for user {user_id}")
    
    async def get_user_generation_history(self, user_id: str, limit: int = 10):
        """Get user's generation history"""
        
        db = get_database()
        
        cursor = db.generation_logs.find({"user_id": user_id}) \
                    .sort("created_at", -1) \
                    .limit(limit)
        
        logs = []
        async for log in cursor:
            # Convert ObjectId and datetime to strings
            serialized_log = {
                "id": str(log["_id"]),
                "user_id": log["user_id"],
                "diagram_id": log.get("diagram_id"),
                "prompt": log["prompt"][:100] + "..." if len(log["prompt"]) > 100 else log["prompt"],
                "diagram_type": log["diagram_type"],
                "is_valid": log["is_valid"],
                "error_message": log.get("error_message"),
                "generation_time": round(log["generation_time"], 2),
                "created_at": log["created_at"].isoformat()
            }
            logs.append(serialized_log)
        
        return logs

generation_service = GenerationService()
