from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    database = None

class RedisClient:
    redis_client: redis.Redis = None

db = Database()
redis_client = RedisClient()

async def connect_to_mongo():
    """Connect to MongoDB"""
    print(f"Connecting to MongoDB: {settings.mongodb_url.replace('password123', '***')}")
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.database = db.client.mermaid_ai_editor
    
    try:
        await db.client.admin.command('ping')
        print("MongoDB connection successful")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    print("Closing MongoDB connection")
    db.client.close()

async def connect_to_redis():
    """Connect to Redis"""
    print(f"Connecting to Redis: {settings.redis_url.replace('redis123', '***')}")
    redis_client.redis_client = redis.from_url(settings.redis_url)
    
    try:
        await redis_client.redis_client.ping()
        print("Redis connection successful")
    except Exception as e:
        print(f"Redis connection failed: {e}")
        raise

async def close_redis_connection():
    """Close Redis connection"""
    print("Closing Redis connection")
    await redis_client.redis_client.close()

def get_database():
    """Get MongoDB database"""
    return db.database

def get_redis():
    """Get Redis client"""
    return redis_client.redis_client
