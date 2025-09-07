# src/backend/app/services/generation_service.py

from datetime import datetime
from typing import Optional, Tuple
from app.core.database import get_database
from app.services.llm_service import llm_service
from app.utils.mermaid_validator import validate_mermaid_syntax, clean_mermaid_code
from app.models.generation import GenerationLog
from app.core.config import settings
import time


class GenerationService:
    
    async def generate_and_log(
        self, 
        user_id: str, 
        prompt: str, 
        diagram_type: str,
        diagram_id: Optional[str] = None,
        model: Optional[str] = None
    ) -> Tuple[Optional[str], Optional[str]]:
        """Generate diagram and log the result with model information"""
        
        # Используем переданную модель или дефолтную
        selected_model = model or settings.default_model
        
        print(f"🤖 Starting generation with model: {selected_model}")
        print(f"📝 Prompt length: {len(prompt)} chars, type: {diagram_type}")
        
        start_time = time.time()
        
        # Generate diagram
        result = await llm_service.generate_diagram(prompt, diagram_type, selected_model)
        
        generation_time = time.time() - start_time
        
        if result:
            # Validate result
            is_valid, error_message = validate_mermaid_syntax(result, diagram_type)
            
            # Log generation with model information
            await self._log_generation(
                user_id=user_id,
                diagram_id=diagram_id,
                prompt=prompt,
                diagram_type=diagram_type,
                model=selected_model,
                generated_code=result,
                is_valid=is_valid,
                error_message=error_message,
                generation_time=generation_time
            )
            
            print(f"✅ Generation completed with {selected_model} in {generation_time:.2f}s")
            print(f"📊 Result: valid={is_valid}, length={len(result)} chars")
            return result, error_message
        else:
            # Log failed generation with model information
            await self._log_generation(
                user_id=user_id,
                diagram_id=diagram_id,
                prompt=prompt,
                diagram_type=diagram_type,
                model=selected_model,
                generated_code="",
                is_valid=False,
                error_message="Generation failed",
                generation_time=generation_time
            )
            
            print(f"❌ Generation failed with {selected_model} after {generation_time:.2f}s")
            return None, "Generation failed"
    
    async def modify_diagram(
        self, 
        user_id: str, 
        diagram_id: str, 
        modification_prompt: str,
        model: Optional[str] = None
    ) -> Tuple[Optional[str], Optional[str]]:
        """Modify existing diagram with specified model"""
        
        selected_model = model or settings.default_model
        print(f"🔧 Starting modification for user {user_id}, diagram {diagram_id}")
        print(f"🤖 Using model: {selected_model}")
        print(f"📝 Modification prompt: {modification_prompt[:100]}...")
        
        db = get_database()
        
        try:
            from bson import ObjectId
            object_id = ObjectId(diagram_id)
            print(f"🆔 ObjectId created: {object_id}")
        except Exception as e:
            print(f"❌ Invalid ObjectId {diagram_id}: {e}")
            return None, f"Invalid diagram ID: {diagram_id}"
        
        # Get original diagram
        diagram = await db.diagrams.find_one({"_id": object_id, "user_id": user_id})
        print(f"🔍 Diagram found: {diagram is not None}")
        
        if not diagram:
            print(f"❌ Diagram not found: {diagram_id} for user {user_id}")
            return None, "Diagram not found"
        
        print(f"📊 Original diagram type: {diagram.get('diagram_type')}")
        print(f"📏 Original code length: {len(diagram.get('mermaid_code', ''))} chars")
        
        # Create modification prompt
        full_prompt = f"""
Current diagram code:
{diagram['mermaid_code']}

Modification request: {modification_prompt}

Please modify the above {diagram['diagram_type']} diagram according to the request.
Return only the modified mermaid code.
"""
        
        print(f"📋 Full prompt length: {len(full_prompt)} chars")
        
        try:
            result = await self.generate_and_log(
                user_id=user_id,
                prompt=full_prompt,
                diagram_type=diagram['diagram_type'],
                diagram_id=diagram_id,
                model=selected_model
            )
            
            print(f"🎯 Modification result: success={result[0] is not None}")
            if result[0]:
                print(f"📏 Modified code length: {len(result[0])} chars")
            
            return result
            
        except Exception as e:
            print(f"❌ Modification generation failed: {e}")
            return None, f"Modification failed: {str(e)}"
 
    async def _log_generation(
        self,
        user_id: str,
        diagram_id: Optional[str],
        prompt: str,
        diagram_type: str,
        model: Optional[str],
        generated_code: str,
        is_valid: bool,
        error_message: Optional[str],
        generation_time: float
    ):
        """Log generation to database with model information"""
        
        db = get_database()
        
        log_data = {
            "user_id": user_id,
            "diagram_id": diagram_id,
            "prompt": prompt,
            "diagram_type": diagram_type,
            "model": model,
            "generated_code": generated_code,
            "is_valid": is_valid,
            "error_message": error_message,
            "generation_time": generation_time,
            "created_at": datetime.utcnow()
        }
        
        try:
            result = await db.generation_logs.insert_one(log_data)
            log_id = str(result.inserted_id)
            print(f"💾 Generation logged: ID={log_id}, user={user_id}, model={model}")
            print(f"📊 Log details: type={diagram_type}, valid={is_valid}, time={generation_time:.2f}s")
            
        except Exception as e:
            print(f"❌ Failed to log generation: {e}")
    
    async def get_user_generation_history(self, user_id: str, limit: int = 10):
        """Get user's generation history with model information"""
        
        print(f"📚 Retrieving generation history for user {user_id}, limit: {limit}")
        
        db = get_database()
        
        try:
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
                    "model": log.get("model", "unknown"),  # Модель с fallback
                    "is_valid": log["is_valid"],
                    "error_message": log.get("error_message"),
                    "generation_time": round(log["generation_time"], 2),
                    "created_at": log["created_at"].isoformat(),
                    "code_length": len(log.get("generated_code", ""))
                }
                logs.append(serialized_log)
            
            print(f"📋 Retrieved {len(logs)} generation logs")
            
            # Статистика по моделям в истории
            model_stats = {}
            for log in logs:
                model = log["model"]
                if model not in model_stats:
                    model_stats[model] = {"count": 0, "success": 0}
                model_stats[model]["count"] += 1
                if log["is_valid"]:
                    model_stats[model]["success"] += 1
            
            print(f"📊 Model statistics: {model_stats}")
            
            return logs
            
        except Exception as e:
            print(f"❌ Error retrieving generation history: {e}")
            return []
    
    async def get_generation_stats_by_model(self, user_id: str, days: int = 30):
        """Get generation statistics grouped by model for analytics"""
        
        print(f"📈 Getting generation stats by model for user {user_id}, last {days} days")
        
        db = get_database()
        
        try:
            from datetime import timedelta
            start_date = datetime.utcnow() - timedelta(days=days)
            
            pipeline = [
                {
                    "$match": {
                        "user_id": user_id,
                        "created_at": {"$gte": start_date}
                    }
                },
                {
                    "$group": {
                        "_id": "$model",
                        "total_generations": {"$sum": 1},
                        "successful_generations": {
                            "$sum": {"$cond": [{"$eq": ["$is_valid", True]}, 1, 0]}
                        },
                        "avg_generation_time": {"$avg": "$generation_time"},
                        "total_code_length": {"$sum": {"$strLenCP": "$generated_code"}},
                        "diagram_types": {"$addToSet": "$diagram_type"}
                    }
                },
                {
                    "$sort": {"total_generations": -1}
                }
            ]
            
            stats = []
            async for stat in db.generation_logs.aggregate(pipeline):
                model_stat = {
                    "model": stat["_id"] or "unknown",
                    "total_generations": stat["total_generations"],
                    "successful_generations": stat["successful_generations"],
                    "success_rate": round(
                        (stat["successful_generations"] / stat["total_generations"]) * 100, 2
                    ) if stat["total_generations"] > 0 else 0,
                    "avg_generation_time": round(stat["avg_generation_time"], 2),
                    "avg_code_length": round(
                        stat["total_code_length"] / stat["total_generations"], 0
                    ) if stat["total_generations"] > 0 else 0,
                    "diagram_types_used": stat["diagram_types"]
                }
                stats.append(model_stat)
            
            print(f"📊 Generated stats for {len(stats)} models")
            return stats
            
        except Exception as e:
            print(f"❌ Error getting model stats: {e}")
            return []
    
    async def get_model_performance_comparison(self):
        """Get overall model performance comparison across all users"""
        
        print("🏆 Getting global model performance comparison")
        
        db = get_database()
        
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$model",
                        "total_users": {"$addToSet": "$user_id"},
                        "total_generations": {"$sum": 1},
                        "successful_generations": {
                            "$sum": {"$cond": [{"$eq": ["$is_valid", True]}, 1, 0]}
                        },
                        "avg_generation_time": {"$avg": "$generation_time"},
                        "diagram_types": {"$addToSet": "$diagram_type"}
                    }
                },
                {
                    "$project": {
                        "model": "$_id",
                        "unique_users": {"$size": "$total_users"},
                        "total_generations": 1,
                        "successful_generations": 1,
                        "success_rate": {
                            "$multiply": [
                                {"$divide": ["$successful_generations", "$total_generations"]},
                                100
                            ]
                        },
                        "avg_generation_time": {"$round": ["$avg_generation_time", 2]},
                        "diagram_types_count": {"$size": "$diagram_types"}
                    }
                },
                {
                    "$sort": {"success_rate": -1}
                }
            ]
            
            comparison = []
            async for stat in db.generation_logs.aggregate(pipeline):
                model_comparison = {
                    "model": stat["model"] or "unknown",
                    "unique_users": stat["unique_users"],
                    "total_generations": stat["total_generations"],
                    "successful_generations": stat["successful_generations"],
                    "success_rate": round(stat["success_rate"], 2),
                    "avg_generation_time": stat["avg_generation_time"],
                    "diagram_types_supported": stat["diagram_types_count"]
                }
                comparison.append(model_comparison)
            
            print(f"🏆 Performance comparison for {len(comparison)} models")
            return comparison
            
        except Exception as e:
            print(f"❌ Error getting model performance comparison: {e}")
            return []


generation_service = GenerationService()
