import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Spotsy Backend Microservice"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE_URL is strictly loaded from .env (no hardcoded fallback URL)
    DATABASE_URL: str
    
    # LLM & AI Keys (Optional)
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://spotsy-frontend:3000",
    ]

    model_config = SettingsConfigDict(
        extra="ignore",
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

settings = Settings()
