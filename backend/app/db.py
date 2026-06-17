from pathlib import Path
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import PyMongoError

from .config import get_settings
from .local_db import LocalDatabase

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | LocalDatabase | None = None


async def connect_to_mongo() -> None:
    global client, database
    settings = get_settings()
    try:
        client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=2000)
        database = client[settings.database_name]
        await database.command("ping")
    except PyMongoError:
        if not settings.can_use_local_db_fallback():
            raise
        if client:
            client.close()
        client = None
        local_path = Path(__file__).resolve().parent / "data" / "localdb.json"
        database = LocalDatabase(local_path)
        await database.command("ping")


async def close_mongo() -> None:
    global client, database
    if client:
        client.close()
    client = None
    database = None


def get_db() -> AsyncIOMotorDatabase | Any:
    if database is None:
        raise RuntimeError("Database is not connected")
    return database
