from app.core.constants import FUND_MEMBERS_COLLECTION
from app.core.enums import Role
from app.repositories.base_repository import BaseRepository


class FundMemberRepository(BaseRepository):
    collection_name = FUND_MEMBERS_COLLECTION

    @classmethod
    async def get_member(
        cls,
        fund_id: str,
        user_id: str,
        session=None,
    ):

        return await cls.find_one(
            {
                "fund_id": fund_id,
                "user_id": user_id,
            },
            session=session,
        )

    @classmethod
    async def get_by_role(
        cls,
        fund_id: str,
        role: Role,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "role": role.value,
            },
            session=session,
        )

    @classmethod
    async def get_super_admin(
        cls,
        fund_id: str,
        session=None,
    ):

        return await cls.find_one(
            {
                "fund_id": fund_id,
                "role": Role.SUPER_ADMIN.value,
            },
            session=session,
        )

    @classmethod
    async def get_admins(
        cls,
        fund_id: str,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "role": Role.ADMIN.value,
            },
            session=session,
        )

    @classmethod
    async def get_members(
        cls,
        fund_id: str,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
            },
            session=session,
        )

    @classmethod
    async def update_role(
        cls,
        fund_id: str,
        user_id: str,
        role: Role,
        session=None,
    ):

        return await cls.update_one(
            {
                "fund_id": fund_id,
                "user_id": user_id,
            },
            {
                "role": role.value,
            },
            session=session,
        )

    @classmethod
    async def update_contribution_transaction(
        cls,
        fund_id: str,
        user_id: str,
        contribution_transaction_id: str,
        session=None,
    ):

        return await cls.update_one(
            {
                "fund_id": fund_id,
                "user_id": user_id,
            },
            {
                "contribution_transaction_id": contribution_transaction_id,
                "contribution_paid": True,
            },
            session=session,
        )

    @classmethod
    async def member_exists(
        cls,
        fund_id: str,
        user_id: str,
        session=None,
    ):

        return await cls.exists(
            {
                "fund_id": fund_id,
                "user_id": user_id,
            },
            session=session,
        )