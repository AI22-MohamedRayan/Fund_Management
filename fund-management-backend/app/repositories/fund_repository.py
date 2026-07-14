from bson import ObjectId

from app.core.constants import FUNDS_COLLECTION
from app.repositories.base_repository import BaseRepository


class FundRepository(BaseRepository):
    collection_name = FUNDS_COLLECTION

    @classmethod
    async def get_by_id(
        cls,
        fund_id: str,
        session=None,
    ):

        return await cls.find_one(
            {
                "_id": ObjectId(fund_id),
            },
            session=session,
        )

    @classmethod
    async def get_by_name(
        cls,
        fund_name: str,
        session=None,
    ):

        return await cls.find_one(
            {
                "fund_name": fund_name,
            },
            session=session,
        )

    @classmethod
    async def get_active_fund(
        cls,
        session=None,
    ):

        return await cls.find_one(
            {
                "is_active": True,
            },
            session=session,
        )