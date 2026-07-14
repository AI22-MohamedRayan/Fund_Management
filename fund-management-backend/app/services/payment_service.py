from datetime import datetime, timedelta, timezone

from app.core.enums import (
    ActivityAction,
    LoanStatus,
    Role,
    TransactionType,
)
from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)
from app.models.payment_model import PaymentModel
from app.repositories.loan_repository import LoanRepository
from app.repositories.payment_repository import PaymentRepository
from app.services.activity_service import ActivityService
from app.services.fine_service import FineService
from app.services.fund_transaction_service import FundTransactionService
from app.services.member_service import MemberService
from app.utils.transaction import start_transaction


class PaymentService:

    @staticmethod
    async def record_payment(
        *,
        fund_id: str,
        loan_id: str,
        amount: int,
        created_by: str,
    ):

        loan = await LoanRepository.get_by_id(loan_id)

        if not loan:
            raise NotFoundException("Loan not found.")

        member = await MemberService.get_member(
            fund_id=fund_id,
            user_id=loan["member_id"],
        )

        if (
            member["role"] in (
                Role.ADMIN.value,
                Role.SUPER_ADMIN.value,
            )
            and loan["member_id"] == created_by
        ):
            raise BadRequestException(
                "Admins cannot record payments for their own loans."
            )

        if loan["status"] != LoanStatus.ACTIVE.value:
            raise BadRequestException(
                "Loan is already completed."
            )

        minimum_payment = min(
    loan["weekly_minimum"],
    loan["outstanding_amount"],
)

        if amount < minimum_payment:
            raise BadRequestException(
            f"Minimum payment is ₹{minimum_payment}."
    )

        if amount > loan["outstanding_amount"]:
            raise BadRequestException(
                "Payment exceeds outstanding amount."
            )

        session = await start_transaction()

        async with session:
            async with session.start_transaction():

                # Late payment
                if loan.get("payment_pending", False):

                    await FineService.create_fine(
                        fund_id=fund_id,
                        loan_id=loan_id,
                        amount=100,
                        reason="Late Weekly Payment",
                        created_by="SYSTEM",
                    )

                    # Reload because outstanding increased by ₹100
                    loan = await LoanRepository.get_by_id(
                        loan_id,
                        session=session,
                    )

                    loan["payment_pending"] = False
                    loan["pending_due_date"] = None
                    loan["last_due_date"] = loan["next_due_date"]
                    loan["next_due_date"] = (
                        loan["next_due_date"] + timedelta(days=7)
                    )

                remaining_amount = (
                    loan["outstanding_amount"] - amount
                )

                payment = PaymentModel.create(
                    fund_id=fund_id,
                    loan_id=loan_id,
                    member_id=loan["member_id"],
                    amount=amount,
                    remaining_amount=remaining_amount,
                    payment_date=datetime.now(timezone.utc),
                    created_by=created_by,
                )

                created_payment = await PaymentRepository.create(
                    payment,
                    session=session,
                )

                await FundTransactionService.record_transaction(
                    fund_id=fund_id,
                    transaction_type=TransactionType.LOAN_REPAYMENT,
                    amount=amount,
                    created_by=created_by,
                    member_id=loan["member_id"],
                    reference_id=created_payment["id"],
                    remarks="Loan Repayment",
                    session=session,
                )

                update = {
                    "outstanding_amount": remaining_amount,
                }

                if loan.get("payment_pending") is False and loan.get("last_due_date") is not None:
                    update["payment_pending"] = False
                    update["pending_due_date"] = None
                    update["last_due_date"] = loan["last_due_date"]
                    update["next_due_date"] = loan["next_due_date"]

                if remaining_amount == 0:
                    update["status"] = LoanStatus.COMPLETED.value

                await LoanRepository.update_loan(
                    loan_id=loan_id,
                    update=update,
                    session=session,
                )

                await ActivityService.log_activity(
                    fund_id=fund_id,
                    action=ActivityAction.PAYMENT_RECORDED,
                    admin_id=created_by,
                    member_id=loan["member_id"],
                    new_value={
                        "payment_amount": amount,
                        "remaining_amount": remaining_amount,
                    },
                    session=session,
                )

                return created_payment

    @staticmethod
    async def get_payment(
        *,
        payment_id: str,
    ):

        payment = await PaymentRepository.get_by_id(
            payment_id,
        )

        if not payment:
            raise NotFoundException("Payment not found.")

        return payment

    @staticmethod
    async def get_loan_payments(
        *,
        loan_id: str,
    ):

        return await PaymentRepository.get_by_loan(
            loan_id=loan_id,
        )

    @staticmethod
    async def get_member_payments(
        *,
        fund_id: str,
        member_id: str,
    ):

        return await PaymentRepository.get_by_member(
            fund_id=fund_id,
            member_id=member_id,
        )

    @staticmethod
    async def get_all_payments(
        *,
        fund_id: str,
    ):

        return await PaymentRepository.get_all_payments(
            fund_id=fund_id,
        )