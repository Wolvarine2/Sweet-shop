from beanie import Document, PydanticObjectId
from pydantic import BaseModel
from datetime import datetime
from typing import List

class OrderItem(BaseModel):
    sweet_id: PydanticObjectId
    sweet_name: str
    quantity: int
    price_at_purchase: float

class Order(Document):
    user_id: PydanticObjectId
    user_email: str
    items: List[OrderItem]
    total_amount: float
    created_at: datetime = datetime.now()

    class Settings:
        name = "orders"

