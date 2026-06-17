from functools import lru_cache
from pathlib import Path
from pydantic import BaseModel
import os


class Settings(BaseModel):
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "sk_enterprises")
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
    jwt_expires_minutes: int = int(os.getenv("JWT_EXPIRES_MINUTES", "10080"))
    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    frontend_origins: str = os.getenv("FRONTEND_ORIGINS", "")
    seed_owner_name: str = os.getenv("SEED_OWNER_NAME", "S.K. Owner")
    seed_owner_phone: str = os.getenv("SEED_OWNER_PHONE", "7007062590")
    seed_owner_password: str = os.getenv("SEED_OWNER_PASSWORD", "Owner@12345")
    whatsapp_number: str = os.getenv("WHATSAPP_NUMBER", "919415216320")
    call_number: str = os.getenv("CALL_NUMBER", "917007062590")
    cloudinary_cloud_name: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    cloudinary_api_key: str = os.getenv("CLOUDINARY_API_KEY", "")
    cloudinary_api_secret: str = os.getenv("CLOUDINARY_API_SECRET", "")
    cloudinary_folder: str = os.getenv("CLOUDINARY_FOLDER", "sk-enterprises/products")
    upload_dir: Path = Path(__file__).resolve().parent / "static" / "uploads"

    def cors_origins(self) -> list[str]:
        base = [self.frontend_origin, "http://127.0.0.1:5173", "http://localhost:5173"]
        extra = [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]
        return list(dict.fromkeys([origin for origin in [*base, *extra] if origin]))


@lru_cache
def get_settings() -> Settings:
    return Settings()
