# Database configuration placeholder
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings


class MongoDB:
    client: AsyncIOMotorClient = None
    database = None


mongodb = MongoDB()


async def connect_to_mongo():
    """
    Create MongoDB connection on application startup.
    """
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongodb.database = mongodb.client[settings.DATABASE_NAME]

    print("✅ Connected to MongoDB")


async def close_mongo_connection():
    """
    Close MongoDB connection on application shutdown.
    """
    if mongodb.client:
        mongodb.client.close()
        print("❌ MongoDB connection closed")


def get_database():
    return mongodb.database