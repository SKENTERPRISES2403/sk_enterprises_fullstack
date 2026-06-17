from __future__ import annotations

import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from bson import ObjectId
from fastapi import Depends, FastAPI, HTTPException, Query, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .db import close_mongo, connect_to_mongo, get_db
from .schemas import (
    AddressIn,
    LeadIn,
    LeadStatusIn,
    LoginIn,
    OrderCreateIn,
    OrderStatusIn,
    ProductIn,
    RegisterIn,
    StaffCreateIn,
)
from .security import create_token, get_current_user, hash_password, public_user, require_roles, verify_password
from .seed import seed_database

settings = get_settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="S.K. Enterprises Ecommerce API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=str(settings.upload_dir)), name="uploads")


@app.on_event("startup")
async def startup() -> None:
    await connect_to_mongo()
    await seed_database(get_db())


@app.on_event("shutdown")
async def shutdown() -> None:
    await close_mongo()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def oid(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=404, detail="Not found")
    return ObjectId(value)


def doc_id(doc: dict[str, Any]) -> dict[str, Any]:
    doc["id"] = str(doc.pop("_id"))
    return doc


def clean_product(product: dict[str, Any]) -> dict[str, Any]:
    return doc_id(product)


async def get_product_or_404(product_id: str) -> dict[str, Any]:
    product = await get_db().products.find_one({"_id": oid(product_id), "active": {"$ne": False}})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return {"ok": True, "brand": "S.K. Enterprises", "time": now_iso()}


@app.post("/api/auth/register")
async def register(payload: RegisterIn) -> dict[str, Any]:
    db = get_db()
    existing = await db.users.find_one({"phone": payload.phone})
    if existing:
        raise HTTPException(status_code=409, detail="Phone already registered")
    user = {
        "name": payload.name,
        "phone": payload.phone,
        "password_hash": hash_password(payload.password),
        "role": "customer",
        "active": True,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id
    token = create_token({"sub": str(result.inserted_id), "role": "customer"})
    return {"token": token, "user": public_user(user)}


@app.post("/api/auth/login")
async def login(payload: LoginIn) -> dict[str, Any]:
    user = await get_db().users.find_one({"phone": payload.phone})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid phone or password")
    if not user.get("active", True):
        raise HTTPException(status_code=403, detail="Account inactive")
    token = create_token({"sub": str(user["_id"]), "role": user.get("role", "customer")})
    return {"token": token, "user": public_user(user)}


@app.get("/api/auth/me")
async def me(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    return {"user": public_user(user)}


@app.post("/api/owner/users")
async def create_staff(payload: StaffCreateIn, _: dict[str, Any] = Depends(require_roles("owner", "admin"))) -> dict[str, Any]:
    db = get_db()
    if await db.users.find_one({"phone": payload.phone}):
        raise HTTPException(status_code=409, detail="Phone already exists")
    user = {
        "name": payload.name,
        "phone": payload.phone,
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "active": True,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id
    return {"user": public_user(user)}


@app.get("/api/categories")
async def categories() -> list[dict[str, Any]]:
    cursor = get_db().categories.find({"active": {"$ne": False}}).sort("name", 1)
    return [doc_id(doc) async for doc in cursor]


@app.get("/api/products")
async def products(
    category: str | None = None,
    search: str | None = None,
    featured: bool | None = None,
) -> list[dict[str, Any]]:
    query: dict[str, Any] = {"active": {"$ne": False}}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    cursor = get_db().products.find(query).sort([("featured", -1), ("name", 1)])
    return [clean_product(doc) async for doc in cursor]


@app.get("/api/products/{product_id}")
async def product_detail(product_id: str) -> dict[str, Any]:
    return clean_product(await get_product_or_404(product_id))


@app.post("/api/admin/products")
async def create_product(payload: ProductIn, _: dict[str, Any] = Depends(require_roles("owner", "admin", "staff"))) -> dict[str, Any]:
    doc = payload.model_dump()
    doc.update({"created_at": now_iso(), "updated_at": now_iso()})
    result = await get_db().products.insert_one(doc)
    doc["_id"] = result.inserted_id
    return clean_product(doc)


@app.put("/api/admin/products/{product_id}")
async def update_product(product_id: str, payload: ProductIn, _: dict[str, Any] = Depends(require_roles("owner", "admin", "staff"))) -> dict[str, Any]:
    updates = payload.model_dump()
    updates["updated_at"] = now_iso()
    result = await get_db().products.find_one_and_update(
        {"_id": oid(product_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return clean_product(result)


@app.delete("/api/admin/products/{product_id}")
async def delete_product(product_id: str, _: dict[str, Any] = Depends(require_roles("owner", "admin"))) -> dict[str, bool]:
    result = await get_db().products.update_one({"_id": oid(product_id)}, {"$set": {"active": False, "updated_at": now_iso()}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}


@app.post("/api/admin/uploads/image")
async def upload_product_image(
    file: UploadFile = File(...),
    _: dict[str, Any] = Depends(require_roles("owner", "admin", "staff")),
) -> dict[str, str]:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")
    ext = Path(file.filename or "upload.jpg").suffix.lower() or ".jpg"
    if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
        ext = ".jpg"
    filename = f"{uuid4().hex}{ext}"
    path = settings.upload_dir / filename
    with path.open("wb") as out:
        shutil.copyfileobj(file.file, out)
    return {"image_url": f"/uploads/{filename}"}


@app.get("/api/addresses")
async def my_addresses(user: dict[str, Any] = Depends(require_roles("customer", "owner", "admin", "staff"))) -> list[dict[str, Any]]:
    cursor = get_db().addresses.find({"user_id": str(user["_id"])}).sort("created_at", -1)
    return [doc_id(doc) async for doc in cursor]


@app.post("/api/addresses")
async def add_address(payload: AddressIn, user: dict[str, Any] = Depends(require_roles("customer", "owner", "admin", "staff"))) -> dict[str, Any]:
    doc = payload.model_dump()
    doc.update({"user_id": str(user["_id"]), "created_at": now_iso(), "updated_at": now_iso()})
    result = await get_db().addresses.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc_id(doc)


@app.post("/api/orders")
async def create_order(payload: OrderCreateIn, user: dict[str, Any] = Depends(require_roles("customer", "owner", "admin", "staff"))) -> dict[str, Any]:
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    subtotal = sum(max(item.price, 0) * item.quantity for item in payload.items)
    order_no = f"SK{datetime.now().strftime('%y%m%d%H%M%S')}"
    doc = {
        "order_no": order_no,
        "user_id": str(user["_id"]),
        "customer": {"name": user["name"], "phone": user["phone"]},
        "items": [item.model_dump() for item in payload.items],
        "address": payload.address.model_dump(),
        "payment_method": payload.payment_method,
        "subtotal": subtotal,
        "status": "New Order",
        "note": payload.note,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    result = await get_db().orders.insert_one(doc)
    doc["_id"] = result.inserted_id
    whatsapp_text = build_order_whatsapp(doc)
    return {"order": doc_id(doc), "whatsapp_text": whatsapp_text, "whatsapp_number": settings.whatsapp_number}


def build_order_whatsapp(order: dict[str, Any]) -> str:
    lines = [
        "Hello S.K. Enterprises!",
        "",
        f"New order placed: {order['order_no']}",
        f"Customer: {order['customer']['name']} ({order['customer']['phone']})",
        f"Payment: {order['payment_method']} / Offline",
        "",
        "Items:",
    ]
    for index, item in enumerate(order["items"], start=1):
        price = f" - Rate: Rs {item['price']}" if item.get("price") else ""
        lines.append(f"{index}. {item['name']} x {item['quantity']}{price}")
    address = order["address"]
    lines.extend([
        "",
        f"Address: {address['line1']} {address.get('line2', '')}, {address['city']} {address.get('pincode', '')}",
        f"Note: {order.get('note') or '-'}",
        "",
        "Please confirm availability, final rate and delivery."
    ])
    return "\n".join(lines)


@app.get("/api/orders/my")
async def my_orders(user: dict[str, Any] = Depends(require_roles("customer", "owner", "admin", "staff"))) -> list[dict[str, Any]]:
    cursor = get_db().orders.find({"user_id": str(user["_id"])}).sort("created_at", -1)
    return [doc_id(doc) async for doc in cursor]


@app.get("/api/admin/orders")
async def admin_orders(_: dict[str, Any] = Depends(require_roles("owner", "admin", "staff"))) -> list[dict[str, Any]]:
    cursor = get_db().orders.find({}).sort("created_at", -1).limit(200)
    return [doc_id(doc) async for doc in cursor]


@app.patch("/api/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, payload: OrderStatusIn, _: dict[str, Any] = Depends(require_roles("owner", "admin", "staff"))) -> dict[str, Any]:
    order = await get_db().orders.find_one_and_update(
        {"_id": oid(order_id)},
        {"$set": {"status": payload.status, "updated_at": now_iso()}},
        return_document=True,
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return doc_id(order)


@app.post("/api/leads")
async def create_lead(payload: LeadIn) -> dict[str, Any]:
    doc = payload.model_dump()
    doc.update({"status": "New", "created_at": now_iso(), "updated_at": now_iso()})
    result = await get_db().leads.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc_id(doc)


@app.get("/api/admin/leads")
async def admin_leads(_: dict[str, Any] = Depends(require_roles("owner", "admin", "staff"))) -> list[dict[str, Any]]:
    cursor = get_db().leads.find({}).sort("created_at", -1).limit(200)
    return [doc_id(doc) async for doc in cursor]


@app.patch("/api/admin/leads/{lead_id}/status")
async def update_lead_status(lead_id: str, payload: LeadStatusIn, _: dict[str, Any] = Depends(require_roles("owner", "admin", "staff"))) -> dict[str, Any]:
    lead = await get_db().leads.find_one_and_update(
        {"_id": oid(lead_id)},
        {"$set": {"status": payload.status, "updated_at": now_iso()}},
        return_document=True,
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return doc_id(lead)


@app.get("/api/admin/dashboard")
async def dashboard(_: dict[str, Any] = Depends(require_roles("owner", "admin", "staff"))) -> dict[str, int]:
    db = get_db()
    return {
        "products": await db.products.count_documents({"active": {"$ne": False}}),
        "orders": await db.orders.count_documents({}),
        "new_orders": await db.orders.count_documents({"status": "New Order"}),
        "leads": await db.leads.count_documents({}),
        "customers": await db.users.count_documents({"role": "customer"}),
    }

