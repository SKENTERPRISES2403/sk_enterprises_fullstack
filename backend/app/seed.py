from __future__ import annotations

from datetime import datetime, timezone

from .config import get_settings
from .security import hash_password

CATEGORIES = [
    "CP Fittings",
    "Sanitaryware",
    "Tiles",
    "Water Tanks",
    "Pipes",
    "Kitchen Sinks",
    "Construction Chemicals",
]

PRODUCTS = [
    {
        "name": "ESSEL CP Fittings Set",
        "brand": "ESSEL",
        "category": "CP Fittings",
        "price": 0,
        "mrp": 0,
        "stock": 25,
        "warranty": "Company warranty",
        "description": "Chrome finish taps, mixers and bathroom CP fittings.",
        "image_url": "/uploads/essel_taps2.jpg",
        "featured": True,
    },
    {
        "name": "Matte Black Tap Collection",
        "brand": "TOYO / ESSEL",
        "category": "CP Fittings",
        "price": 0,
        "mrp": 0,
        "stock": 18,
        "warranty": "As per brand",
        "description": "Premium matte black fittings for modern bathrooms.",
        "image_url": "/uploads/black_taps.jpg",
        "featured": True,
    },
    {
        "name": "Birla Pivot Western Toilet",
        "brand": "Birla Pivot",
        "category": "Sanitaryware",
        "price": 0,
        "mrp": 0,
        "stock": 12,
        "warranty": "Brand warranty",
        "description": "Modern western toilet and sanitaryware options.",
        "image_url": "/uploads/birla_toilet.jpg",
        "featured": True,
    },
    {
        "name": "Bathroom Setup Combo",
        "brand": "ESSEL / Cera / Birla Pivot",
        "category": "Sanitaryware",
        "price": 0,
        "mrp": 0,
        "stock": 10,
        "warranty": "As per selected items",
        "description": "Bathroom sanitaryware, tiles and fittings bundle for new homes.",
        "image_url": "/uploads/bathroom_demo.jpg",
        "featured": False,
    },
    {
        "name": "Floor & Wall Tiles",
        "brand": "Somany / Oasis / Nexcera",
        "category": "Tiles",
        "price": 0,
        "mrp": 0,
        "stock": 400,
        "warranty": "",
        "description": "Ceramic, vitrified and porcelain tile range.",
        "image_url": "/uploads/tiles.jpg",
        "featured": True,
    },
    {
        "name": "Designer Tile Samples",
        "brand": "Ambani / Somany / Oasis",
        "category": "Tiles",
        "price": 0,
        "mrp": 0,
        "stock": 250,
        "warranty": "",
        "description": "Texture and color samples for bathrooms, kitchens and floors.",
        "image_url": "/uploads/tile_samples.jpg",
        "featured": False,
    },
    {
        "name": "Water Tanks",
        "brand": "Sintex / Supreme",
        "category": "Water Tanks",
        "price": 0,
        "mrp": 0,
        "stock": 14,
        "warranty": "Brand warranty",
        "description": "Durable water storage tanks for home and project use.",
        "image_url": "/uploads/tanks.jpg",
        "featured": True,
    },
    {
        "name": "Supreme & Ashirvad Pipes",
        "brand": "Supreme / Ashirvad",
        "category": "Pipes",
        "price": 0,
        "mrp": 0,
        "stock": 200,
        "warranty": "Brand warranty",
        "description": "Plumbing pipes and fittings for residential and project needs.",
        "image_url": "/uploads/shop.jpg",
        "featured": False,
    },
    {
        "name": "Kitchen Sink Range",
        "brand": "Nirali / ESSEL / Gunjan",
        "category": "Kitchen Sinks",
        "price": 0,
        "mrp": 0,
        "stock": 20,
        "warranty": "As per brand",
        "description": "Scratch-resistant kitchen sinks in multiple sizes.",
        "image_url": "/uploads/sink.jpg",
        "featured": True,
    },
    {
        "name": "Roff Tile Adhesive",
        "brand": "Roff by Pidilite",
        "category": "Construction Chemicals",
        "price": 0,
        "mrp": 0,
        "stock": 75,
        "warranty": "",
        "description": "Tile and stone fixing adhesives, grouts and chemicals.",
        "image_url": "/uploads/roff.jpg",
        "featured": True,
    },
]

GALLERY = [
    {
        "title": "Showroom Exterior",
        "caption": "S.K. Enterprises storefront on Kanihar Road.",
        "image_url": "/uploads/shop.jpg",
        "position": 1,
    },
    {
        "title": "Sanitaryware Display",
        "caption": "Premium CP fittings, sanitaryware and bathroom display.",
        "image_url": "/uploads/gallery2.jpg",
        "position": 2,
    },
    {
        "title": "Tiles and Bath Collection",
        "caption": "Floor tiles, wall tiles and bathroom product range.",
        "image_url": "/uploads/tile_samples.jpg",
        "position": 3,
    },
    {
        "title": "Dealership Wall",
        "caption": "Authorized dealer boards and brand display.",
        "image_url": "/uploads/showroom_wall.jpg",
        "position": 4,
    },
    {
        "title": "CP Fittings Range",
        "caption": "ESSEL, TOYO and premium tap collections.",
        "image_url": "/uploads/essel_taps2.jpg",
        "position": 5,
    },
    {
        "title": "Construction Chemicals",
        "caption": "Roff by Pidilite tile adhesive and project materials.",
        "image_url": "/uploads/roff.jpg",
        "position": 6,
    },
]


async def seed_database(db) -> None:
    settings = get_settings()
    now = datetime.now(timezone.utc).isoformat()

    for name in CATEGORIES:
        await db.categories.update_one(
            {"name": name},
            {"$setOnInsert": {"name": name, "active": True, "created_at": now}},
            upsert=True,
        )

    for product in PRODUCTS:
        await db.products.update_one(
            {"name": product["name"]},
            {"$setOnInsert": {**product, "active": True, "created_at": now, "updated_at": now}},
            upsert=True,
        )

    for item in GALLERY:
        await db.gallery.update_one(
            {"title": item["title"]},
            {"$setOnInsert": {**item, "active": True, "created_at": now, "updated_at": now}},
            upsert=True,
        )

    owner = await db.users.find_one({"phone": settings.seed_owner_phone})
    if owner is None:
        await db.users.insert_one({
            "name": settings.seed_owner_name,
            "phone": settings.seed_owner_phone,
            "password_hash": hash_password(settings.seed_owner_password),
            "role": "owner",
            "active": True,
            "created_at": now,
            "updated_at": now,
        })
