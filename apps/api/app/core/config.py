from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "trysomenew"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "trysomenew_dev_secret_key_change_in_production_9f81a7b"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://trysomenew.com",
        "https://project.netlify.app",
        "*",
    ]
    MAX_UPLOAD_SIZE_BYTES: int = 100 * 1024 * 1024  # 100 MB limit
    ENVIRONMENT: str = "development"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
