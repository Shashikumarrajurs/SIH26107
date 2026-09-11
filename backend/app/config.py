import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "NexaStandards"
    TAGLINE: str = "From scattered standards documents to trusted, actionable compliance support."
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Confidence Gate (Strict Grounding Threshold)
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.75"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bis_smartassist.db")
    
    # Vector DB
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    
    # LLM Provider
    ENABLE_OLLAMA: bool = os.getenv("ENABLE_OLLAMA", "false").lower() == "true"
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "qwen2.5:7b")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "bge-m3")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "nexastandards_sih26107_secret_key_2026_super_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Cache
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Voice Provider
    VOICE_PROVIDER: str = os.getenv("VOICE_PROVIDER", "web_speech_api")

settings = Settings()

