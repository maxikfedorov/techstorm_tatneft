from datetime import datetime, timedelta
from typing import Optional
from app.core.database import get_database, get_redis
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import UserCreate, UserInDB, UserLogin
from app.core.config import settings

class AuthService:
    
    async def create_user(self, user_data: UserCreate) -> Optional[UserInDB]:
        """Create new user"""
        db = get_database()
        
        existing_user = await db.users.find_one({"username": user_data.username})
        if existing_user:
            print(f"User {user_data.username} already exists")
            return None
        
        existing_email = await db.users.find_one({"email": user_data.email})
        if existing_email:
            print(f"Email {user_data.email} already exists")
            return None
        
        user_dict = {
            "username": user_data.username,
            "email": user_data.email,
            "password_hash": get_password_hash(user_data.password),
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = await db.users.insert_one(user_dict)
        user_dict["id"] = str(result.inserted_id)
        print(f"User created: {user_data.username}")
        
        return UserInDB(**user_dict)
    
    async def authenticate_user(self, login_data: UserLogin) -> Optional[UserInDB]:
        """Authenticate user"""
        db = get_database()
        
        user = await db.users.find_one({"username": login_data.username})
        if not user:
            print(f"User {login_data.username} not found")
            return None
        
        if not verify_password(login_data.password, user["password_hash"]):
            print(f"Invalid password for user {login_data.username}")
            return None
        
        user["id"] = str(user["_id"])
        print(f"User authenticated: {login_data.username}")
        return UserInDB(**user)
    
    async def create_user_session(self, username: str) -> str:
        """Create user session and return token"""
        token = create_access_token(data={"sub": username})
        
        redis = get_redis()
        await redis.setex(
            f"token:{token}", 
            timedelta(minutes=settings.access_token_expire_minutes), 
            username
        )
        
        print(f"Session created for user: {username}")
        return token
    
    async def logout_user(self, token: str) -> bool:
        """Logout user by invalidating token"""
        redis = get_redis()
        result = await redis.delete(f"token:{token}")
        print(f"Token invalidated: {bool(result)}")
        return bool(result)

auth_service = AuthService()
