from app.core.constants import ACTIVITY_LOGS_COLLECTION
from app.core.enums import ActivityAction
from app.repositories.base_repository import BaseRepository


class ActivityRepository(BaseRepository):
    collection_name = ACTIVITY_LOGS_COLLECTION

    @classmethod
    async def get_logs(
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
    async def get_by_action(
        cls,
        fund_id: str,
        action: ActivityAction,
        limit: int = 100,
        skip: int = 0,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "action": action.value,
            },
            limit=limit,
            skip=skip,
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_by_admin(
        cls,
        fund_id: str,
        admin_id: str,
        limit: int = 100,
        skip: int = 0,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "admin_id": admin_id,
            },
            limit=limit,
            skip=skip,
            sort=[("created_at", -1)],
            session=session,
        )

    @classmethod
    async def get_by_member(
        cls,
        fund_id: str,
        member_id: str,
        limit: int = 100,
        skip: int = 0,
        session=None,
    ):

        return await cls.find_many(
            {
                "fund_id": fund_id,
                "member_id": member_id,
            },
            limit=limit,
            skip=skip,
            sort=[("created_at", -1)],
            session=session,
        )
    