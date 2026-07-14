from app.config.database import mongodb


async def start_transaction():
    return await mongodb.client.start_session()