from __future__ import annotations

import base64
import bcrypt
import hashlib
import hmac
import json
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from bson import ObjectId

from .config import get_settings
from .db import get_db

bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, stored: str) -> bool:
    if stored.startswith("$2a$") or stored.startswith("$2b$") or stored.startswith("$2y$"):
        return bcrypt.checkpw(password.encode("utf-8"), stored.encode("utf-8"))
    try:
        scheme, salt_b64, digest_b64 = stored.split("$", 2)
        if scheme != "pbkdf2_sha256":
            return False
        salt = base64.b64decode(salt_b64)
        expected = base64.b64decode(digest_b64)
        actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 240_000)
        return hmac.compare_digest(actual, expected)
    except Exception:
        return False


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(value: str) -> bytes:
    padded = value + "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(padded.encode("ascii"))


def create_token(payload: dict[str, Any]) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    body = {
        **payload,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=settings.jwt_expires_minutes)).timestamp()),
    }
    header = {"alg": "HS256", "typ": "JWT"}
    signing_input = f"{_b64url(json.dumps(header, separators=(',', ':')).encode())}.{_b64url(json.dumps(body, separators=(',', ':')).encode())}"
    signature = hmac.new(settings.jwt_secret.encode("utf-8"), signing_input.encode("ascii"), hashlib.sha256).digest()
    return f"{signing_input}.{_b64url(signature)}"


def decode_token(token: str) -> dict[str, Any]:
    try:
      header_b64, payload_b64, signature_b64 = token.split(".")
      signing_input = f"{header_b64}.{payload_b64}"
      expected = hmac.new(get_settings().jwt_secret.encode("utf-8"), signing_input.encode("ascii"), hashlib.sha256).digest()
      actual = _b64url_decode(signature_b64)
      if not hmac.compare_digest(actual, expected):
          raise ValueError("Bad signature")
      payload = json.loads(_b64url_decode(payload_b64))
      if int(payload.get("exp", 0)) < int(datetime.now(timezone.utc).timestamp()):
          raise ValueError("Expired token")
      return payload
    except Exception as exc:
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc


async def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict[str, Any]:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login required")
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id or not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
    user = await get_db().users.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("active", True):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    user["id"] = str(user["_id"])
    return user


def require_roles(*roles: str):
    async def _role_user(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        if user.get("role") not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permission")
        return user
    return _role_user


def public_user(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(user.get("_id", user.get("id"))),
        "name": user.get("name"),
        "phone": user.get("phone"),
        "role": user.get("role"),
        "active": user.get("active", True),
        "created_at": user.get("created_at"),
    }
