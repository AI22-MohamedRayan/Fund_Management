from app.repositories.user_repository import UserRepository
from app.services.member_service import MemberService
from app.services.loan_service import LoanService
from app.services.payment_service import PaymentService
from app.services.fine_service import FineService


class PublicLedgerService:

    @staticmethod
    async def get_public_ledger(
        *,
        fund_id: str,
    ):

        members = await MemberService.get_members(
            fund_id=fund_id,
        )

        ledger = []

        for member in members:

            user = await UserRepository.get_by_id(
                member["user_id"],
            )

            loans = await LoanService.get_member_loans(
                fund_id=fund_id,
                member_id=member["user_id"],
            )

            loan = loans[0] if loans else None

            payments = await PaymentService.get_member_payments(
                fund_id=fund_id,
                member_id=member["user_id"],
            )

            fines = await FineService.get_member_fines(
                fund_id=fund_id,
                member_id=member["user_id"],
            )

            total_paid = sum(
                payment["amount"]
                for payment in payments
            )

            total_fine = sum(
                fine["amount"]
                for fine in fines
                if fine["status"] == "ACTIVE"
            )

            last_payment = (
                payments[-1]
                if payments
                else None
            )

            ledger.append(
                {
                    "member_id": member["user_id"],
                    "member_name": user["name"],
                    "phone_number": user["phone"],
                    "role": member["role"],

                    "next_due_date": (
                        loan["next_due_date"]
                        if loan
                        else None
                    ),

                    "original_loan_amount": (
                        loan["principal_amount"]
                        if loan
                        else 0
                    ),

                    "outstanding_amount": (
                        loan["outstanding_amount"]
                        if loan
                        else 0
                    ),

                    "total_fine": total_fine,

                    "total_due": (
                        loan["outstanding_amount"]
                        if loan
                        else 0
                    ),

                    "total_paid": total_paid,

                    "last_payment_amount": (
                        last_payment["amount"]
                        if last_payment
                        else 0
                    ),

                    "last_payment_date": (
                        last_payment["payment_date"]
                        if last_payment
                        else None
                    ),
                }
            )

        return ledger