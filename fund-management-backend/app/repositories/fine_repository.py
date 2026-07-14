from bson import ObjectId
from app.core.constants import FINES_COLLECTION
from app.core.enums import FineStatus
from app.repositories.base_repository import BaseRepository


class FineRepository(BaseRepository):
    collection_name = FINES_COLLECTION

    @classmethod
    async def get_by_loan(
        cls,
        loan_id: str,
        session=None,
    ):

        return await cls.find_many(
            {
                "loan_id": loan_id,
            },
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_by_member(
        cls,
        fund_id: str,
        member_id: str,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "member_id": member_id,
            },
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_all_fines(
        cls,
        fund_id: str,
        limit: int = 100,
        skip: int = 0,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
            },
            limit=limit,
            skip=skip,
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_active_fines(
        cls,
        fund_id: str,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "status": FineStatus.ACTIVE.value,
            },
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_cancelled_fines(
        cls,
        fund_id: str,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "status": FineStatus.CANCELLED.value,
            },
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_total_active_fines(
        cls,
        fund_id: str,
        session=None,
    ):

        pipeline = [
            {
                "$match": {
                    "fund_id": fund_id,
                    "status": FineStatus.ACTIVE.value,
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total": {
                        "$sum": "$amount"
                    }
                }
            }
        ]

        result = await cls.aggregate(
            pipeline,
            session=session,
        )

        if not result:
            return 0

        return result[0]["total"]

    @classmethod
    async def cancel_fine(
        cls,
        fine_id: str,
        reason: str,
        session=None,
    ):

        return await cls.update_one(
            {
                "_id": ObjectId(fine_id),
            },
            {
                "status": FineStatus.CANCELLED.value,
                "cancel_reason": reason,
            },
            session=session,
        )