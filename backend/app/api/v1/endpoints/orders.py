from fastapi import APIRouter, Depends, HTTPException
from beanie import PydanticObjectId
from typing import List
from pydantic import BaseModel
from app.models.order import Order, OrderItem
from app.models.sweet import Sweet
from app.models.user import User
from app.api.deps import get_current_user, get_current_admin
from app.services.websocket_manager import manager

router = APIRouter()

class PurchaseItem(BaseModel):
    sweet_id: PydanticObjectId
    quantity: int

class PurchaseRequest(BaseModel):
    items: List[PurchaseItem]

@router.post("/", status_code=201)
async def create_order(request: PurchaseRequest, user: User = Depends(get_current_user)):
    order_items = []
    total = 0.0

    # Process items sequentially
    for item in request.items:
        sweet = await Sweet.get(item.sweet_id)
        if not sweet:
            raise HTTPException(404, f"Sweet {item.sweet_id} not found")
        
        if sweet.quantity < item.quantity:
            raise HTTPException(400, f"Not enough stock for {sweet.name}")
        
        # 1. Update Stock
        sweet.quantity -= item.quantity
        await sweet.save()
        
        # 2. Realtime Stock Update (For Users)
        await manager.broadcast_stock_update(sweet.dict())

        # 3. Add to Order
        order_items.append(OrderItem(
            sweet_id=sweet.id,
            sweet_name=sweet.name,
            quantity=item.quantity,
            price_at_purchase=sweet.price
        ))
        total += (sweet.price * item.quantity)

    # 4. Save Order
    order = Order(
        user_id=user.id,
        user_email=user.email,
        items=order_items,
        total_amount=total
    )
    await order.insert()
    
    # 5. Notify Admins (New Order Alert)
    await manager.broadcast_new_order(order.dict())
    
    return order

@router.get("/my-history")
async def get_my_orders(user: User = Depends(get_current_user)):
    """Get orders for the current user"""
    orders = await Order.find(Order.user_id == user.id).to_list()
    return orders

@router.get("/all")
async def get_all_orders(admin: User = Depends(get_current_admin)):
    """Get all orders (admin only)"""
    orders = await Order.find_all().to_list()
    return orders

