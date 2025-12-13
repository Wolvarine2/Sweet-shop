from beanie import Document
from pydantic import EmailStr
from enum import Enum

class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"

class User(Document):
    email: EmailStr
    hashed_password: str
    role: Role = Role.USER

    class Settings:
        name = "users"

