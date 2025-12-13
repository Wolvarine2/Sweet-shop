from beanie import Document
from pydantic import BaseModel
from typing import Optional

class Sweet(Document):
    name: str
    category: str
    price: float
    quantity: int
    image_url: Optional[str] = "https://placehold.co/200x200?text=Sweet"

    class Settings:
        name = "sweets"

class SweetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    image_url: Optional[str] = None

