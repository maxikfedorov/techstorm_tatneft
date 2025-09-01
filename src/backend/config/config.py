# src/backend/app/config.py
class Settings:
    LM_STUDIO_URL = "http://127.0.0.1:1234"
    LM_STUDIO_MODEL = "openai/gpt-oss-20b"
    CORS_ORIGINS = ["http://localhost:5173"]

settings = Settings()
