# Activity service placeholder
from app.core.enums import ActivityAction
from app.models.activity_model import ActivityModel
from app.repositories.activity_repository import ActivityRepository


class ActivityService:

    @staticmethod
    async def log_activity(
        *,
        fund_id: str,
        action: ActivityAction,
        admin_id: str,
        member_id: str | None = None,
        old_value: dict | None = None,
        new_value: dict | None = None,
        session=None,
    ):

        activity = ActivityModel.create(
            fund_id=fund_id,
            action=action,
            admin_id=admin_id,
            member_id=member_id,
            old_value=old_value,
            new_value=new_value,
        )

        return await ActivityRepository.create(
            activity,
            session=session,
        )

    @staticmethod
    async def get_logs(
        *,
        fund_id: str,
        limit: int = 100,
        skip: int = 0,
    ):

        return await ActivityRepository.get_logs(
            fund_id=fund_id,
            limit=limit,
            skip=skip,
        )

    @staticmethod
    async def get_logs_by_action(
        *,
        fund_id: str,
        action: ActivityAction,
        limit: int = 100,
        skip: int = 0,
    ):

        return await ActivityRepository.get_by_action(
            fund_id=fund_id,
            action=action,
            limit=limit,
            skip=skip,
        )

    @staticmethod
    async def get_admin_logs(
        *,
        fund_id: str,
        admin_id: str,
        limit: int = 100,
        skip: int = 0,
    ):

        return await ActivityRepository.get_by_admin(
            fund_id=fund_id,
            admin_id=admin_id,
            limit=limit,
            skip=skip,
        )

    @staticmethod
    async def get_member_logs(
        *,
        fund_id: str,
        member_id: str,
        limit: int = 100,
        skip: int = 0,
    ):

        return await ActivityRepository.get_by_member(
            fund_id=fund_id,
            member_id=member_id,
            limit=limit,
            skip=skip,
        )