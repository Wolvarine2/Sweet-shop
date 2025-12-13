import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User, Role
from app.core.security import get_password_hash
from app.core.config import settings

async def create_sample_users():
    """Create sample admin and user accounts"""
    try:
        # Connect to MongoDB
        print("🔌 Connecting to MongoDB...")
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("✅ Connected to MongoDB!")
        
        # Initialize Beanie
        await init_beanie(
            database=client.sweet_shop,
            document_models=[User]
        )
        
        # Create Admin User
        admin_email = "admin@gmail.com"
        admin_password = "admin@123"
        
        existing_admin = await User.find_one(User.email == admin_email)
        if existing_admin:
            print(f"⚠️  Admin user {admin_email} already exists. Skipping...")
        else:
            admin_user = User(
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                role=Role.ADMIN
            )
            await admin_user.insert()
            print(f"✅ Created admin user: {admin_email}")
        
        # Create Regular User
        user_email = "user@gmail.com"
        user_password = "user@123"
        
        existing_user = await User.find_one(User.email == user_email)
        if existing_user:
            print(f"⚠️  User {user_email} already exists. Skipping...")
        else:
            regular_user = User(
                email=user_email,
                hashed_password=get_password_hash(user_password),
                role=Role.USER
            )
            await regular_user.insert()
            print(f"✅ Created regular user: {user_email}")
        
        print("\n📋 User Credentials:")
        print("=" * 50)
        print("Admin:")
        print(f"  Email: {admin_email}")
        print(f"  Password: {admin_password}")
        print("\nUser:")
        print(f"  Email: {user_email}")
        print(f"  Password: {user_password}")
        print("=" * 50)
        
        client.close()
        print("\n✅ Done! Users created successfully.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Make sure:")
        print("1. MongoDB connection is working")
        print("2. .env file has correct MONGODB_URL")
        print("3. Your IP is whitelisted in MongoDB Atlas")
        raise

if __name__ == "__main__":
    asyncio.run(create_sample_users())

