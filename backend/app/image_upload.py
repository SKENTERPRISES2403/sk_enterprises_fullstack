from __future__ import annotations

import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from .config import Settings

try:
    import cloudinary
    import cloudinary.uploader
except ImportError:  # Local development can still use filesystem uploads.
    cloudinary = None


ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def cloudinary_is_configured(settings: Settings) -> bool:
    return bool(settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret)


def validate_image_upload(file: UploadFile) -> str:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")
    ext = Path(file.filename or "upload.jpg").suffix.lower() or ".jpg"
    return ext if ext in ALLOWED_EXTENSIONS else ".jpg"


def upload_image(file: UploadFile, settings: Settings) -> str:
    ext = validate_image_upload(file)
    if cloudinary_is_configured(settings):
        if cloudinary is None:
            raise HTTPException(status_code=500, detail="Cloudinary package is not installed")
        try:
            cloudinary.config(
                cloud_name=settings.cloudinary_cloud_name,
                api_key=settings.cloudinary_api_key,
                api_secret=settings.cloudinary_api_secret,
                secure=True,
            )
            result = cloudinary.uploader.upload(
                file.file,
                folder=settings.cloudinary_folder,
                resource_type="image",
                unique_filename=True,
                overwrite=False,
            )
        except Exception as exc:
            raise HTTPException(status_code=502, detail="Image upload failed") from exc
        secure_url = result.get("secure_url")
        if not secure_url:
            raise HTTPException(status_code=502, detail="Cloudinary did not return an image URL")
        return secure_url

    filename = f"{uuid4().hex}{ext}"
    path = settings.upload_dir / filename
    with path.open("wb") as out:
        shutil.copyfileobj(file.file, out)
    return f"/uploads/{filename}"
