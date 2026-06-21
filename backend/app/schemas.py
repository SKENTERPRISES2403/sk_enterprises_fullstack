from __future__ import annotations

import re
from typing import Literal
from pydantic import BaseModel, Field, field_validator

Role = Literal["customer", "staff", "admin", "owner"]
OrderStatus = Literal["New Order", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"]
LeadStatus = Literal["New", "Contacted", "Converted", "Closed"]


def validate_phone(value: str) -> str:
    phone = str(value).strip()
    if not re.fullmatch(r"\d{10}", phone):
        raise ValueError("Phone number must be exactly 10 digits")
    return phone


class PhoneIn(BaseModel):
    phone: str

    @field_validator("phone")
    @classmethod
    def phone_must_be_10_digits(cls, value: str) -> str:
        return validate_phone(value)


class LoginIn(PhoneIn):
    phone: str
    password: str


class RegisterIn(PhoneIn):
    name: str
    phone: str
    password: str


class StaffCreateIn(RegisterIn):
    role: Literal["staff", "admin"]


class ProductIn(BaseModel):
    name: str
    brand: str = ""
    series: str = ""
    category: str
    price: float = Field(default=0, ge=0)
    mrp: float = Field(default=0, ge=0)
    stock: int = Field(default=0, ge=0)
    warranty: str = ""
    description: str = ""
    image_url: str = ""
    image_urls: list[str] = Field(default_factory=list)
    featured: bool = False
    active: bool = True


class ProductOut(ProductIn):
    id: str


class BrandIn(BaseModel):
    name: str
    logo_url: str = ""
    description: str = ""
    warranty: str = ""
    position: int = 0
    active: bool = True


class AddressIn(PhoneIn):
    label: str = "Home"
    name: str
    phone: str
    line1: str
    line2: str
    city: str = "Prayagraj"
    pincode: str = ""

    @field_validator("line1", "line2")
    @classmethod
    def address_lines_required(cls, value: str) -> str:
        text = str(value).strip()
        if not text:
            raise ValueError("Address line 1 and address line 2 are required")
        return text


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


class LeadIn(PhoneIn):
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
