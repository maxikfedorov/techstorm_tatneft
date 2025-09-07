from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import (
    connect_to_mongo, 
    close_mongo_connection,
    connect_to_redis,
    close_redis_connection,
    get_database,
    get_redis
)
from app.routes import auth, generation, diagrams, workspace

def create_app() -> FastAPI:
    """Create FastAPI application"""
    app = FastAPI(
        title="Text to Diagram API",
        version="1.0.0",
        description="Convert text descriptions to Mermaid diagrams"
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(auth.router, prefix="/auth", tags=["auth"])
    app.include_router(generation.router, prefix="/generate", tags=["generation"])
    app.include_router(diagrams.router, prefix="/diagrams", tags=["diagrams"])
    app.include_router(workspace.router, prefix="/workspace", tags=["workspace"])
    
    return app

app = create_app()

@app.on_event("startup")
async def startup_event():
    """Initialize connections on startup"""
    print("=== Text to Diagram API Starting ===")
    await connect_to_mongo()
    await connect_to_redis()
    print("=====================================")

@app.on_event("shutdown")
async def shutdown_event():
    """Close connections on shutdown"""
    print("=== Shutting down API ===")
    await close_mongo_connection()
    await close_redis_connection()
    print("======================")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Text to Diagram API is running",
        "status": "healthy"
    }

@app.get("/config")
async def get_config():
    """Get current configuration (for testing)"""
    print("Configuration requested")
    return {
        "mongodb_url": settings.mongodb_url,
        "redis_url": settings.redis_url,
        "llm_api_url": settings.llm_api_url,
        "environment": "docker" if "mongodb:27017" in settings.mongodb_url else "local"
    }

@app.get("/health/db")
async def health_check_databases():
    """Check database connections"""
    print("Database health check requested")
    
    mongo_status = "connected"
    redis_status = "connected"
    
    try:
        db = get_database()
        await db.command('ping')
    except Exception as e:
        print(f"MongoDB health check failed: {e}")
        mongo_status = "disconnected"
    
    try:
        redis = get_redis()
        await redis.ping()
    except Exception as e:
        print(f"Redis health check failed: {e}")
        redis_status = "disconnected"
    
    return {
        "mongodb": mongo_status,
        "redis": redis_status,
        "overall": "healthy" if mongo_status == "connected" and redis_status == "connected" else "unhealthy"
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting Text to Diagram API server...")
    uvicorn.run("app.app:app", host="0.0.0.0", port=8000, reload=True)
