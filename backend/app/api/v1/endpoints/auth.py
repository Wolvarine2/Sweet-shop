from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from app.models.user import User, Role
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: Role = Role.USER

@router.post("/register", status_code=201)
async def register(user_in: UserRegister):
    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user_in.email, 
        hashed_password=get_password_hash(user_in.password), 
        role=user_in.role
    )
    await new_user.insert()
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {
        "access_token": create_access_token(user.email),
        "token_type": "bearer",
        "role": user.role,
        "email": user.email
    }

