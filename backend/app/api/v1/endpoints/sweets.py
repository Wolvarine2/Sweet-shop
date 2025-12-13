from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from beanie import PydanticObjectId
from app.models.sweet import Sweet, SweetUpdate
from app.models.user import User
from app.api.deps import get_current_user, get_current_admin
from app.services.websocket_manager import manager

router = APIRouter()

@router.get("/", response_model=List[Sweet])
async def get_sweets():
    return await Sweet.find_all().to_list()

@router.get("/search", response_model=List[Sweet])
async def search_sweets(q: str):
    return await Sweet.find({"$or": [
        {"name": {"$regex": q, "$options": "i"}},
        {"category": {"$regex": q, "$options": "i"}}
    ]}).to_list()

@router.post("/", status_code=201)
async def create_sweet(sweet: Sweet, admin: User = Depends(get_current_admin)):
    await sweet.insert()
    await manager.broadcast_stock_update(sweet.dict())
    return sweet

@router.put("/{id}")
async def update_sweet(id: PydanticObjectId, update: SweetUpdate, admin: User = Depends(get_current_admin)):
    sweet = await Sweet.get(id)
    if not sweet:
        raise HTTPException(404, "Sweet not found")
    
    await sweet.set(update.dict(exclude_unset=True))
    await manager.broadcast_stock_update(sweet.dict())
    return sweet

@router.delete("/{id}")
async def delete_sweet(id: PydanticObjectId, admin: User = Depends(get_current_admin)):
    sweet = await Sweet.get(id)
    if sweet:
        await sweet.delete()
        # Broadcast deletion (id only)
        await manager.broadcast_stock_update({"_id": str(id), "deleted": True})
    return {"message": "Deleted"}

