# Expense repository placeholder
from app.core.constants import EXPENSES_COLLECTION
from app.repositories.base_repository import BaseRepository


class ExpenseRepository(BaseRepository):
    collection_name = EXPENSES_COLLECTION

    @classmethod
    async def get_all_expenses(
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
    async def get_latest_expenses(
        cls,
        fund_id: str,
        limit: int = 10,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
            },
            limit=limit,
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_total_expenses(
        cls,
        fund_id: str,
        session=None,
    ):

        pipeline = [
            {
                "$match": {
                    "fund_id": fund_id,
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