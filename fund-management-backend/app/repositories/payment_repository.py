from datetime import datetime
from bson import ObjectId

from app.core.constants import PAYMENTS_COLLECTION
from app.repositories.base_repository import BaseRepository


class PaymentRepository(BaseRepository):
    collection_name = PAYMENTS_COLLECTION

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
            sort=[("payment_date", 1)],
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
            sort=[("payment_date", 1)],
            session=session,
        )

    @classmethod
    async def get_all_payments(
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
            sort=[("payment_date", -1)],
            session=session,
        )

    @classmethod
    async def get_latest_payment(
        cls,
        loan_id: str,
        session=None,
    ):

        payments = await cls.find_many(
            {
                "loan_id": loan_id,
            },
            limit=1,
            sort=[("payment_date", -1)],
            session=session,
        )

        if not payments:
            return None

        return payments[0]

    @classmethod
    async def get_total_paid(
        cls,
        loan_id: str,
        session=None,
    ):

        pipeline = [
            {
                "$match": {
                    "loan_id": loan_id,
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
    async def get_payments_between_dates(
        cls,
        *,
        loan_id: str,
        start_date: datetime,
        end_date: datetime,
        session=None,
    ):

        return await cls.find_many(
            {
                "loan_id": loan_id,
                "payment_date": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            },
            sort=[("payment_date", 1)],
            session=session,
        )

    @classmethod
    async def delete_payment(
        cls,
        payment_id: str,
        session=None,
    ):

        raise Exception(
            "Payments cannot be deleted."
        )