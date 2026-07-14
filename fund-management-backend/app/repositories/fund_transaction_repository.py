from datetime import datetime

from app.core.constants import FUND_TRANSACTIONS_COLLECTION
from app.core.enums import TransactionType
from app.repositories.base_repository import BaseRepository


class FundTransactionRepository(BaseRepository):
    collection_name = FUND_TRANSACTIONS_COLLECTION

    @classmethod
    async def get_by_reference(
        cls,
        reference_id: str,
        session=None,
    ):

        return await cls.find_one(
            {
                "reference_id": reference_id,
            },
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
    async def get_by_type(
        cls,
        fund_id: str,
        transaction_type: TransactionType,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "transaction_type": transaction_type.value,
            },
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_transactions(
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
    async def get_transactions_between_dates(
        cls,
        fund_id: str,
        start_date: datetime,
        end_date: datetime,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "created_at": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            },
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_total_by_type(
        cls,
        fund_id: str,
        transaction_type: TransactionType,
        session=None,
    ):

        pipeline = [
            {
                "$match": {
                    "fund_id": fund_id,
                    "transaction_type": transaction_type.value,
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