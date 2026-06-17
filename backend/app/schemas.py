from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field

Role = Literal["customer", "staff", "admin", "owner"]
OrderStatus = Literal["New Order", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"]
LeadStatus = Literal["New", "Contacted", "Converted", "Closed"]


class LoginIn(BaseModel):
    phone: str
    password: str


class RegisterIn(BaseModel):
    name: str
    phone: str
    password: str


class StaffCreateIn(RegisterIn):
    role: Literal["staff", "admin"]


class ProductIn(BaseModel):
    name: str
    brand: str = ""
    category: str
    price: float = 0
    mrp: float = 0
    stock: int = 0
    warranty: str = ""
    description: str = ""
    image_url: str = ""
    featured: bool = False
    active: bool = True


class ProductOut(ProductIn):
    id: str


class AddressIn(BaseModel):
    label: str = "Home"
    name: str
    phone: str
    line1: str
    line2: str = ""
    city: str = "Prayagraj"
    pincode: str = ""


class CartItemIn(BaseModel):
    product_id: str
    name: str
    price: float = 0
    quantity: int = Field(default=1, ge=1)


class OrderCreateIn(BaseModel):
    items: list[CartItemIn]
    address: AddressIn
    payment_method: Literal["WhatsApp", "Cash", "UPI"] = "WhatsApp"
    note: str = ""


class OrderStatusIn(BaseModel):
    status: OrderStatus


class LeadIn(BaseModel):
    name: str
    phone: str
    category: str = ""
    message: str


class LeadStatusIn(BaseModel):
    status: LeadStatus


class GalleryIn(BaseModel):
    title: str
    caption: str = ""
    image_url: str
    position: int = 0
    active: bool = True


class CertificateIn(BaseModel):
    title: str
    brand: str = ""
    caption: str = ""
    image_url: str
    position: int = 0
    active: bool = True
