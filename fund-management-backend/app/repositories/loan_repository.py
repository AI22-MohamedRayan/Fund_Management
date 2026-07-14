from bson import ObjectId

from app.core.constants import LOANS_COLLECTION
from app.core.enums import LoanStatus
from app.repositories.base_repository import BaseRepository


class LoanRepository(BaseRepository):
    collection_name = LOANS_COLLECTION

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
    async def get_by_id(
        cls,
        loan_id: str,
        session=None,
    ):

        return await cls.find_one(
            {
                "_id": ObjectId(loan_id),
            },
            session=session,
        )

    @classmethod
    async def get_active_loan(
        cls,
        fund_id: str,
        member_id: str,
        session=None,
    ):

        return await cls.find_one(
            {
                "fund_id": fund_id,
                "member_id": member_id,
                "status": LoanStatus.ACTIVE.value,
            },
            session=session,
        )

    @classmethod
    async def get_active_loans(
        cls,
        fund_id: str | None = None,
        session=None,
    ):

        query = {
            "status": LoanStatus.ACTIVE.value,
        }

        if fund_id:
            query["fund_id"] = fund_id

        return await cls.find_many(
            query,
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_completed_loans(
        cls,
        fund_id: str,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "status": LoanStatus.COMPLETED.value,
            },
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_all_loans(
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
    async def update_loan(
        cls,
        loan_id: str,
        update: dict,
        session=None,
    ):

        return await cls.update_one(
            {
                "_id": ObjectId(loan_id),
            },
            update,
            session=session,
        )

    @classmethod
    async def has_active_loan(
        cls,
        fund_id: str,
        member_id: str,
        session=None,
    ):

        return await cls.exists(
            {
                "fund_id": fund_id,
                "member_id": member_id,
                "status": LoanStatus.ACTIVE.value,
            },
            session=session,
        )