# Expense service placeholder
from app.core.enums import (
    ActivityAction,
    TransactionType,
)
from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)
from app.models.expense_model import ExpenseModel
from app.repositories.expense_repository import ExpenseRepository
from app.services.activity_service import ActivityService
from app.services.balance_service import BalanceService
from app.services.fund_transaction_service import FundTransactionService
from app.utils.transaction import start_transaction


class ExpenseService:

    @staticmethod
    async def create_expense(
        *,
        fund_id: str,
        amount: int,
        description: str,
        created_by: str,
    ):

        has_balance = await BalanceService.has_sufficient_balance(
            fund_id=fund_id,
            required_amount=amount,
        )

        if not has_balance:
            raise BadRequestException(
                "Insufficient fund balance."
            )

        expense = ExpenseModel.create(
            fund_id=fund_id,
            amount=amount,
            description=description,
            created_by=created_by,
        )

        session = await start_transaction()

        async with session:
            async with session.start_transaction():

                created_expense = await ExpenseRepository.create(
                    expense,
                    session=session,
                )

                await FundTransactionService.record_transaction(
                    fund_id=fund_id,
                    transaction_type=TransactionType.EXPENSE,
                    amount=amount,
                    created_by=created_by,
                    reference_id=created_expense["id"],
                    remarks=description,
                    session=session,
                )

                await ActivityService.log_activity(
                    fund_id=fund_id,
                    action=ActivityAction.EXPENSE_ADDED,
                    admin_id=created_by,
                    new_value={
                        "amount": amount,
                        "description": description,
                    },
                    session=session,
                )

                return created_expense

    @staticmethod
    async def get_expense(
        *,
        expense_id: str,
    ):

        expense = await ExpenseRepository.get_by_id(
            expense_id,
        )

        if not expense:
            raise NotFoundException(
                "Expense not found."
            )

        return expense

    @staticmethod
    async def get_all_expenses(
        *,
        fund_id: str,
    ):

        return await ExpenseRepository.get_all_expenses(
            fund_id=fund_id,
        )

    @staticmethod
    async def get_latest_expenses(
        *,
        fund_id: str,
    ):

        return await ExpenseRepository.get_latest_expenses(
            fund_id=fund_id,
        )

    @staticmethod
    async def get_total_expenses(
        *,
        fund_id: str,
    ):

        return await ExpenseRepository.get_total_expenses(
            fund_id=fund_id,
        )