from datetime import datetime, timezone

from app.core.enums import (
    ActivityAction,
    LoanStatus,
    Role,
    TransactionType,
)
from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    NotFoundException,
)
from app.models.loan_model import LoanModel
from app.repositories.loan_repository import LoanRepository
from app.services.activity_service import ActivityService
from app.services.balance_service import BalanceService
from app.services.fund_transaction_service import FundTransactionService
from app.services.member_service import MemberService
from app.utils.transaction import start_transaction


class LoanService:

    @staticmethod
    async def create_loan(
        *,
        fund_id: str,
        member_id: str,
        loan_amount: int,
        created_by: str,
    ):

        member = await MemberService.get_member(
            fund_id=fund_id,
            user_id=member_id,
        )

        if not member:
            raise NotFoundException("Member not found.")

        if (
            member["role"] in (
                Role.ADMIN.value,
                Role.SUPER_ADMIN.value,
            )
            and member_id == created_by
        ):
            raise BadRequestException(
                "Admins cannot manage their own loans."
            )

        active_loan = await LoanRepository.get_active_loan(
            fund_id=fund_id,
            member_id=member_id,
        )

        if active_loan:
            raise ConflictException(
                "Member already has an active loan."
            )

        has_balance = await BalanceService.has_sufficient_balance(
            fund_id=fund_id,
            required_amount=loan_amount,
        )

        if not has_balance:
            raise BadRequestException(
                "Insufficient fund balance."
            )

        interest = (loan_amount // 5000) * 750

        disbursed_amount = loan_amount - interest

        weekly_minimum = loan_amount // 10

        loan_date = datetime.now(timezone.utc)

        loan = LoanModel.create(
            fund_id=fund_id,
            member_id=member_id,
            principal_amount=loan_amount,
            interest=interest,
            disbursed_amount=disbursed_amount,
            outstanding_amount=loan_amount,
            weekly_minimum=weekly_minimum,
            loan_date=loan_date,
            created_by=created_by,
        )

        session = await start_transaction()

        async with session:
            async with session.start_transaction():

                created_loan = await LoanRepository.create(
                    loan,
                    session=session,
                )

                await FundTransactionService.record_transaction(
    fund_id=fund_id,
    transaction_type=TransactionType.LOAN_DISBURSEMENT,
    amount=loan_amount,
    created_by=created_by,
    member_id=member_id,
    reference_id=created_loan["id"],
    remarks="Loan Disbursement",
    session=session,
)

                await ActivityService.log_activity(
                    fund_id=fund_id,
                    action=ActivityAction.LOAN_CREATED,
                    admin_id=created_by,
                    member_id=member_id,
                    new_value={
                        "loan_amount": loan_amount,
                        "interest": interest,
                        "cash_given": disbursed_amount,
                    },
                    session=session,
                )

                return created_loan

    @staticmethod
    async def get_loan(
        *,
        loan_id: str,
    ):

        loan = await LoanRepository.get_by_id(
            loan_id,
        )

        if not loan:
            raise NotFoundException(
                "Loan not found."
            )

        return loan

    @staticmethod
    async def get_member_loans(
        *,
        fund_id: str,
        member_id: str,
    ):

        return await LoanRepository.get_by_member(
            fund_id=fund_id,
            member_id=member_id,
        )

    @staticmethod
    async def get_active_loans(
        *,
        fund_id: str,
    ):

        return await LoanRepository.get_active_loans(
            fund_id=fund_id,
        )

    @staticmethod
    async def get_all_loans(
        *,
        fund_id: str,
    ):

        return await LoanRepository.get_all_loans(
            fund_id=fund_id,
        )