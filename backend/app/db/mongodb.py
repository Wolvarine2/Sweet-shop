from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.sweet import Sweet
from app.models.order import Order

async def init_db():
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Test connection
        await client.admin.command('ping')
        await init_beanie(
            database=client.sweet_shop,
            document_models=[User, Sweet, Order]
        )
        print("✅ MongoDB connected successfully!")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Check your .env file - ensure MONGODB_URL has the correct password")
        print("2. Whitelist your IP in MongoDB Atlas: Network Access > Add IP Address")
        print("3. Verify your MongoDB Atlas username and password are correct")
        raise

