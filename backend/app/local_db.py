from __future__ import annotations

import copy
import json
import re
from pathlib import Path
from types import SimpleNamespace
from typing import Any

from bson import ObjectId


class LocalCursor:
    def __init__(self, docs: list[dict[str, Any]]):
        self.docs = docs
        self.index = 0

    def sort(self, key_or_list, direction: int | None = None) -> "LocalCursor":
        sort_fields = key_or_list if isinstance(key_or_list, list) else [(key_or_list, direction or 1)]
        for key, order in reversed(sort_fields):
            self.docs.sort(key=lambda doc: str(doc.get(key, "")).lower(), reverse=order == -1)
        return self

    def limit(self, count: int) -> "LocalCursor":
        self.docs = self.docs[:count]
        return self

    def __aiter__(self) -> "LocalCursor":
        return self

    async def __anext__(self) -> dict[str, Any]:
        if self.index >= len(self.docs):
            raise StopAsyncIteration
        doc = self.docs[self.index]
        self.index += 1
        return copy.deepcopy(doc)


class LocalCollection:
    def __init__(self, db: "LocalDatabase", name: str):
        self.db = db
        self.name = name

    @property
    def docs(self) -> list[dict[str, Any]]:
        return self.db.data.setdefault(self.name, [])

    async def find_one(self, query: dict[str, Any]) -> dict[str, Any] | None:
        for doc in self.docs:
            if self._matches(doc, query):
                return copy.deepcopy(doc)
        return None

    async def insert_one(self, doc: dict[str, Any]) -> SimpleNamespace:
        inserted_id = doc.get("_id") or ObjectId()
        stored = copy.deepcopy(doc)
        stored["_id"] = str(inserted_id)
        self.docs.append(stored)
        self.db.save()
        return SimpleNamespace(inserted_id=inserted_id)

    def find(self, query: dict[str, Any]) -> LocalCursor:
        return LocalCursor([copy.deepcopy(doc) for doc in self.docs if self._matches(doc, query)])

    async def update_one(self, query: dict[str, Any], update: dict[str, Any], upsert: bool = False) -> SimpleNamespace:
        for doc in self.docs:
            if self._matches(doc, query):
                if "$set" in update:
                    doc.update(copy.deepcopy(update["$set"]))
                self.db.save()
                return SimpleNamespace(matched_count=1, upserted_id=None)
        if upsert:
            inserted: dict[str, Any] = {key: value for key, value in query.items() if not isinstance(value, dict)}
            inserted.update(copy.deepcopy(update.get("$setOnInsert", {})))
            inserted.update(copy.deepcopy(update.get("$set", {})))
            result = await self.insert_one(inserted)
            return SimpleNamespace(matched_count=0, upserted_id=result.inserted_id)
        return SimpleNamespace(matched_count=0, upserted_id=None)

    async def find_one_and_update(self, query: dict[str, Any], update: dict[str, Any], return_document: Any = None) -> dict[str, Any] | None:
        for doc in self.docs:
            if self._matches(doc, query):
                if "$set" in update:
                    doc.update(copy.deepcopy(update["$set"]))
                self.db.save()
                return copy.deepcopy(doc)
        return None

    async def count_documents(self, query: dict[str, Any]) -> int:
        return sum(1 for doc in self.docs if self._matches(doc, query))

    def _matches(self, doc: dict[str, Any], query: dict[str, Any]) -> bool:
        for key, expected in query.items():
            if key == "$or":
                if not any(self._matches(doc, clause) for clause in expected):
                    return False
                continue
            actual = doc.get(key)
            if isinstance(expected, ObjectId):
                if str(actual) != str(expected):
                    return False
                continue
            if isinstance(expected, dict):
                if "$ne" in expected and actual == expected["$ne"]:
                    return False
                if "$regex" in expected:
                    flags = re.IGNORECASE if "i" in expected.get("$options", "") else 0
                    if not re.search(expected["$regex"], str(actual or ""), flags):
                        return False
                continue
            if actual != expected:
                return False
        return True


class LocalDatabase:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.data: dict[str, list[dict[str, Any]]] = self._load()

    def _load(self) -> dict[str, list[dict[str, Any]]]:
        if not self.path.exists():
            return {}
        return json.loads(self.path.read_text(encoding="utf-8"))

    def save(self) -> None:
        self.path.write_text(json.dumps(self.data, indent=2), encoding="utf-8")

    async def command(self, command_name: str) -> dict[str, int]:
        if command_name != "ping":
            raise ValueError(f"Unsupported local database command: {command_name}")
        return {"ok": 1}

    def __getattr__(self, name: str) -> LocalCollection:
        if name.startswith("_"):
            raise AttributeError(name)
        return LocalCollection(self, name)
