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
        "price": 2499,
        "mrp": 3499,
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
        "price": 1899,
        "mrp": 2599,
        "stock": 18,
        "warranty": "As per brand",
        "description": "Premium matte black fittings for modern bathrooms.",
        "image_url": "/uploads/black_taps.jpg",
        "featured": True,
    },
    {
        "name": "FlowKem PTMT Taps",
        "brand": "FlowKem",
        "category": "CP Fittings",
        "price": 299,
        "mrp": 449,
        "stock": 30,
        "warranty": "Brand warranty",
        "description": "FlowKem PTMT taps, fittings, pipes and tanks for home and project use.",
        "image_url": "/uploads/flowkem-logo.png",
        "featured": False,
    },
    {
        "name": "Birla Pivot Western Toilet",
        "brand": "Birla Pivot",
        "category": "Sanitaryware",
        "price": 7490,
        "mrp": 9490,
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
        "price": 15990,
        "mrp": 21990,
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
        "price": 64,
        "mrp": 85,
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
        "price": 72,
        "mrp": 95,
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
        "price": 4490,
        "mrp": 5790,
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
        "price": 95,
        "mrp": 125,
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
        "price": 2690,
        "mrp": 3490,
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
        "price": 420,
        "mrp": 550,
        "stock": 75,
        "warranty": "",
        "description": "Tile and stone fixing adhesives, grouts and chemicals.",
        "image_url": "/uploads/roff.jpg",
        "featured": True,
    },
    {
        "name": "Araldite Epoxy Adhesive",
        "brand": "Araldite",
        "category": "Construction Chemicals",
        "price": 180,
        "mrp": 240,
        "stock": 40,
        "warranty": "As per brand",
        "description": "Strong epoxy adhesive for repair, bonding and project work.",
        "image_url": "/uploads/araldite-logo.png",
        "featured": False,
    },
]

BRANDS = [
    {
        "name": "ESSEL",
        "logo_url": "/uploads/essel-logo.png",
        "description": "CP fittings, taps, showers, urinals, basins and bathroom accessories.",
        "warranty": "Up to 10 years warranty on selected fittings",
        "position": 1,
    },
    {
        "name": "Birla Pivot",
        "logo_url": "/uploads/birla-pivot-logo.jpg",
        "description": "Sanitaryware and modern bath solutions for homes and projects.",
        "warranty": "Brand warranty on selected sanitaryware",
        "position": 2,
    },
    {
        "name": "Roff by Pidilite",
        "logo_url": "/uploads/roff-logo.png",
        "description": "Tile adhesive, grout and tile-stone fixing chemicals.",
        "warranty": "Company supplied project material",
        "position": 3,
    },
    {
        "name": "Supreme",
        "logo_url": "/uploads/supreme-logo.png",
        "description": "Pipes, fittings and water management products.",
        "warranty": "Brand warranty on selected products",
        "position": 4,
    },
    {
        "name": "Ashirvad",
        "logo_url": "/uploads/ashirvad-logo.png",
        "description": "CPVC, UPVC and plumbing pipe systems.",
        "warranty": "Brand warranty on selected pipes",
        "position": 5,
    },
    {
        "name": "CERA",
        "logo_url": "/uploads/cera-logo.png",
        "description": "Premium sanitaryware and bathroom solutions.",
        "warranty": "Brand warranty on selected sanitaryware",
        "position": 6,
    },
    {
        "name": "Hindware",
        "logo_url": "/uploads/hindware-logo.png",
        "description": "Sanitaryware, basins, toilets and bath products.",
        "warranty": "Brand warranty on selected products",
        "position": 7,
    },
    {
        "name": "Sintex",
        "logo_url": "/uploads/sintex-logo.png",
        "description": "Water tanks and storage solutions.",
        "warranty": "Brand warranty on selected tanks",
        "position": 8,
    },
    {
        "name": "Araldite",
        "logo_url": "/uploads/araldite-logo.png",
        "description": "Epoxy adhesive for repairs, bonding and project work.",
        "warranty": "As per brand",
        "position": 9,
    },
    {
        "name": "FlowKem",
        "logo_url": "/uploads/flowkem-logo.png",
        "description": "PTMT taps, pipes, fittings and tanks for homes and projects.",
        "warranty": "Brand warranty on selected products",
        "position": 10,
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

CERTIFICATES = [
    {
        "title": "ESSEL Authorized Dealership",
        "brand": "ESSEL Bath Fittings",
        "caption": "Certificate of authorised dealership for S.K. Enterprises, Prayagraj.",
        "image_url": "/uploads/essel-certificate.jpeg",
        "position": 1,
    },
    {
        "title": "Roff Dealer Certificate",
        "brand": "Roff by Pidilite",
        "caption": "Dealer certificate for tile and stone fixing solutions.",
        "image_url": "/uploads/roff-certificate.jpeg",
        "position": 2,
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
        existing = await db.products.find_one({"name": product["name"]})
        if existing:
            updates = {}
            if not float(existing.get("price") or 0):
                updates["price"] = product["price"]
            if not float(existing.get("mrp") or 0):
                updates["mrp"] = product["mrp"]
            if updates:
                updates["updated_at"] = now
                await db.products.update_one({"_id": existing["_id"]}, {"$set": updates})
            continue

        await db.products.insert_one({**product, "active": True, "created_at": now, "updated_at": now})

    for brand in BRANDS:
        await db.brands.update_one(
            {"name": brand["name"]},
            {"$setOnInsert": {**brand, "active": True, "created_at": now, "updated_at": now}},
            upsert=True,
        )

    for item in GALLERY:
        await db.gallery.update_one(
            {"title": item["title"]},
            {"$setOnInsert": {**item, "active": True, "created_at": now, "updated_at": now}},
            upsert=True,
        )

    for item in CERTIFICATES:
        await db.certificates.update_one(
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
