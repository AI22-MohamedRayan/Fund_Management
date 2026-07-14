from app.core.enums import (
    ActivityAction,
    FineStatus,
    Role,
    TransactionType,
)
from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)
from app.models.fine_model import FineModel
from app.repositories.fine_repository import FineRepository
from app.repositories.loan_repository import LoanRepository
from app.services.activity_service import ActivityService
from app.services.fund_transaction_service import FundTransactionService
from app.services.member_service import MemberService
from app.utils.transaction import start_transaction


class FineService:

    @staticmethod
    async def create_fine(
        *,
        fund_id: str,
        loan_id: str,
        amount: int,
        reason: str,
        created_by: str,
    ):

        loan = await LoanRepository.get_by_id(loan_id)

        if not loan:
            raise NotFoundException("Loan not found.")

        if created_by != "SYSTEM":

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
                    "Admins cannot manage fines for their own loans."
                )

        fine = FineModel.create(
            fund_id=fund_id,
            loan_id=loan_id,
            member_id=loan["member_id"],
            amount=amount,
            reason=reason,
            created_by=created_by,
        )

        session = await start_transaction()

        async with session:
            async with session.start_transaction():

                created_fine = await FineRepository.create(
                    fine,
                    session=session,
                )

                await LoanRepository.update_loan(
                    loan_id=loan_id,
                    update={
                        "outstanding_amount": loan["outstanding_amount"] + amount,
                    },
                    session=session,
                )

                

                await ActivityService.log_activity(
                    fund_id=fund_id,
                    action=ActivityAction.FINE_ADDED,
                    admin_id=created_by,
                    member_id=loan["member_id"],
                    new_value={
                        "amount": amount,
                        "reason": reason,
                    },
                    session=session,
                )

                return created_fine

    @staticmethod
    async def cancel_fine(
        *,
        fine_id: str,
        reason: str,
        cancelled_by: str,
    ):

        fine = await FineRepository.get_by_id(fine_id)

        if not fine:
            raise NotFoundException("Fine not found.")

        if fine["status"] == FineStatus.CANCELLED.value:
            raise BadRequestException("Fine is already cancelled.")

        member = await MemberService.get_member(
            fund_id=fine["fund_id"],
            user_id=fine["member_id"],
        )

        if (
            member["role"] in (
                Role.ADMIN.value,
                Role.SUPER_ADMIN.value,
            )
            and fine["member_id"] == cancelled_by
        ):
            raise BadRequestException(
                "Admins cannot manage fines for their own loans."
            )

        session = await start_transaction()

        async with session:
            async with session.start_transaction():

                updated = await FineRepository.cancel_fine(
                    fine_id=fine_id,
                    reason=reason,
                    session=session,
                )

                loan = await LoanRepository.get_by_id(
                    fine["loan_id"],
                    session=session,
                )

                await LoanRepository.update_loan(
                    loan_id=fine["loan_id"],
                    update={
                        "outstanding_amount": loan["outstanding_amount"] - fine["amount"],
                    },
                    session=session,
                )

                await ActivityService.log_activity(
                    fund_id=fine["fund_id"],
                    action=ActivityAction.FINE_CANCELLED,
                    admin_id=cancelled_by,
                    member_id=fine["member_id"],
                    old_value=fine,
                    new_value={
                        "status": FineStatus.CANCELLED.value,
                        "cancel_reason": reason,
                    },
                    session=session,
                )

                return updated

    @staticmethod
    async def get_fine(
        *,
        fine_id: str,
    ):

        fine = await FineRepository.get_by_id(fine_id)

        if not fine:
            raise NotFoundException("Fine not found.")

        return fine

    @staticmethod
    async def get_all_fines(
        *,
        fund_id: str,
    ):

        return await FineRepository.get_all_fines(
            fund_id=fund_id,
        )

    @staticmethod
    async def get_active_fines(
        *,
        fund_id: str,
    ):

        return await FineRepository.get_active_fines(
            fund_id=fund_id,
        )

    @staticmethod
    async def get_member_fines(
        *,
        fund_id: str,
        member_id: str,
    ):

        return await FineRepository.get_by_member(
            fund_id=fund_id,
            member_id=member_id,
        )

    @staticmethod
    async def get_loan_fines(
        *,
        loan_id: str,
    ):

        return await FineRepository.get_by_loan(
            loan_id=loan_id,
        )