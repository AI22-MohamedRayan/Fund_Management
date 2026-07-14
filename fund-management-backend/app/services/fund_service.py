# Fund service placeholder
from app.config.settings import settings
from app.core.enums import (
    ActivityAction,
    Role,
    TransactionType,
)
from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
)
from app.models.fund_model import FundModel
from app.repositories.fund_repository import FundRepository
from app.services.activity_service import ActivityService
from app.services.fund_transaction_service import FundTransactionService
from app.services.member_service import MemberService
from app.utils.transaction import start_transaction


class FundService:

    @staticmethod
    async def create_fund(
        *,
        fund_name: str,
        contribution_amount: int,
        previous_balance: int,
        super_admin_password: str,
        created_by: str,
    ):

        # Validate Super Admin Password
        if super_admin_password != settings.SUPER_ADMIN_PASSWORD:
            raise ForbiddenException("Invalid Super Admin password.")

        # Check duplicate fund name
        existing = await FundRepository.get_by_name(fund_name)

        if existing:
            raise ConflictException(
                "A fund with this name already exists."
            )

        session = await start_transaction()

        async with session:

            async with session.start_transaction():

                # Create Fund
                fund = FundModel.create(
                    fund_name=fund_name,
                    contribution_amount=contribution_amount,
                    opening_balance=previous_balance,
                    created_by=created_by,
                )

                created_fund = await FundRepository.create(
                    fund,
                    session=session,
                )

                fund_id = created_fund["id"]

                # Add Creator as Super Admin
                await MemberService.add_member(
                    fund_id=fund_id,
                    user_id=created_by,
                    created_by=created_by,
                    role=Role.SUPER_ADMIN,
                    contribution_paid=True,
                    session=session,
                )

                # Opening Balance Transaction
                if previous_balance > 0:

                    await FundTransactionService.record_transaction(
                        fund_id=fund_id,
                        transaction_type=TransactionType.OPENING_BALANCE,
                        amount=previous_balance,
                        created_by=created_by,
                        remarks="Opening Balance",
                        session=session,
                    )


                # Activity Log
                await ActivityService.log_activity(
                    fund_id=fund_id,
                    action=ActivityAction.FUND_CREATED,
                    admin_id=created_by,
                    new_value={
                        "fund_name": fund_name,
                        "contribution_amount": contribution_amount,
                        "opening_balance": previous_balance,
                    },
                    session=session,
                )

                return created_fund

    @staticmethod
    async def get_all_funds(
        *,
        limit: int = 100,
        skip: int = 0,
    ):
        return await FundRepository.find_many(
            query={
                "is_active": True,
            },
            limit=limit,
            skip=skip,
        )

    @staticmethod
    async def get_fund_by_id(
        *,
        fund_id: str,
    ):
        return await FundRepository.get_by_id(fund_id)
            