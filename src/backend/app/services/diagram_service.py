from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from app.core.database import get_database
from app.models.diagram import DiagramCreate, DiagramUpdate, DiagramInDB, DiagramListItem

class DiagramService:
    
    async def create_diagram(self, user_id: str, diagram_data: DiagramCreate, original_prompt: Optional[str] = None) -> DiagramInDB:
        """Create new diagram"""
        db = get_database()
        
        diagram_dict = {
            "user_id": user_id,
            "title": diagram_data.title,
            "description": diagram_data.description,
            "diagram_type": diagram_data.diagram_type,
            "mermaid_code": diagram_data.mermaid_code,
            "original_prompt": original_prompt,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.diagrams.insert_one(diagram_dict)
        diagram_dict["id"] = str(result.inserted_id)
        
        print(f"Diagram created: {diagram_data.title} for user {user_id}")
        return DiagramInDB(**diagram_dict)
    
    async def get_user_diagrams(self, user_id: str, limit: int = 50) -> List[DiagramListItem]:
        """Get user's diagrams list"""
        db = get_database()
        
        cursor = db.diagrams.find({"user_id": user_id}) \
                    .sort("updated_at", -1) \
                    .limit(limit)
        
        diagrams = []
        async for diagram in cursor:
            diagram_item = DiagramListItem(
                id=str(diagram["_id"]),
                title=diagram["title"],
                diagram_type=diagram["diagram_type"],
                created_at=diagram["created_at"],
                updated_at=diagram["updated_at"]
            )
            diagrams.append(diagram_item)
        
        print(f"Retrieved {len(diagrams)} diagrams for user {user_id}")
        return diagrams
    
    async def get_diagram(self, user_id: str, diagram_id: str) -> Optional[DiagramInDB]:
        """Get specific diagram by ID"""
        db = get_database()
        
        try:
            object_id = ObjectId(diagram_id)
        except:
            print(f"Invalid diagram ID: {diagram_id}")
            return None
        
        diagram = await db.diagrams.find_one({"_id": object_id, "user_id": user_id})
        
        if not diagram:
            print(f"Diagram not found: {diagram_id} for user {user_id}")
            return None
        
        diagram["id"] = str(diagram["_id"])
        return DiagramInDB(**diagram)
    
    async def update_diagram(self, user_id: str, diagram_id: str, update_data: DiagramUpdate) -> Optional[DiagramInDB]:
        """Update diagram"""
        db = get_database()
        
        try:
            object_id = ObjectId(diagram_id)
        except:
            return None
        
        # Build update dict with only non-None values
        update_dict = {"updated_at": datetime.utcnow()}
        if update_data.title is not None:
            update_dict["title"] = update_data.title
        if update_data.description is not None:
            update_dict["description"] = update_data.description
        if update_data.mermaid_code is not None:
            update_dict["mermaid_code"] = update_data.mermaid_code
        
        result = await db.diagrams.update_one(
            {"_id": object_id, "user_id": user_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            print(f"Diagram not found for update: {diagram_id}")
            return None
        
        # Return updated diagram
        updated_diagram = await db.diagrams.find_one({"_id": object_id})
        updated_diagram["id"] = str(updated_diagram["_id"])
        
        print(f"Diagram updated: {diagram_id}")
        return DiagramInDB(**updated_diagram)
    
    async def delete_diagram(self, user_id: str, diagram_id: str) -> bool:
        """Delete diagram"""
        db = get_database()
        
        try:
            object_id = ObjectId(diagram_id)
        except:
            return False
        
        result = await db.diagrams.delete_one({"_id": object_id, "user_id": user_id})
        
        success = result.deleted_count > 0
        print(f"Diagram deletion: {diagram_id} - {'success' if success else 'failed'}")
        return success
    
    async def get_diagram_stats(self, user_id: str) -> dict:
        """Get user's diagram statistics"""
        db = get_database()
        
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": "$diagram_type",
                "count": {"$sum": 1}
            }}
        ]
        
        stats = {}
        async for result in db.diagrams.aggregate(pipeline):
            stats[result["_id"]] = result["count"]
        
        total_count = await db.diagrams.count_documents({"user_id": user_id})
        
        return {
            "total_diagrams": total_count,
            "by_type": stats
        }

diagram_service = DiagramService()
