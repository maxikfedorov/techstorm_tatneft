# src/backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://admin:password123@localhost:27017"
    redis_url: str = "redis://:redis123@localhost:6379"
    llm_api_url: str = "http://127.0.0.1:1234"
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Добавляем настройки моделей
    available_models: list = [
        "openai/gpt-oss-20b",
        "gemma-3-270m-it", 
        "google/gemma-3n-e4b",
        "qwen/qwen3-4b",
        "microsoft/phi-4-mini-reasoning",
    ]
    default_model: str = "openai/gpt-oss-20b"
    
    class Config:
        env_file = ".env"


settings = Settings()
