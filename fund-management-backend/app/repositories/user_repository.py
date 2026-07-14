from app.core.constants import USERS_COLLECTION
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository):

    collection_name = USERS_COLLECTION

    @classmethod
    async def get_by_phone(cls, phone: str):

        return await cls.find_one(
            {
                "phone": phone
            }
        )

    @classmethod
    async def search(
        cls,
        search: str,
        limit: int = 10,
    ):

        return await cls.find_many(
            {
                "$or": [
                    {
                        "name": {
                            "$regex": search,
                            "$options": "i"
                        }
                    },
                    {
                        "phone": {
                            "$regex": search
                        }
                    }
                ]
            },
            limit=limit,
        )