from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sweet Shop API"
    MONGODB_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ORIGINS: List[str] = ["*"]  # Allow all for development

    class Config:
        env_file = ".env"

settings = Settings()

