from datetime import datetime, timedelta, timezone

from app.repositories.loan_repository import LoanRepository
from app.repositories.payment_repository import PaymentRepository
from app.services.fine_service import FineService


class DailyScheduler:

    @staticmethod
    async def repayment_day_check():
        """
        Runs every day at 11:55 PM.
        """

        today = datetime.now(timezone.utc).date()

        loans = await LoanRepository.get_active_loans()

        for loan in loans:

            if loan["next_due_date"].date() != today:
                continue

            payments = await PaymentRepository.get_payments_between_dates(
                loan_id=loan["id"],
                start_date=loan["last_due_date"] or loan["loan_date"],
                end_date=loan["next_due_date"],
            )

            total_paid = sum(
                payment["amount"]
                for payment in payments
            )

            if total_paid >= loan["weekly_minimum"]:

                await LoanRepository.update_loan(
                    loan_id=loan["id"],
                    update={
                        "last_due_date": loan["next_due_date"],
                        "next_due_date": loan["next_due_date"] + timedelta(days=7),
                        "payment_pending": False,
                        "pending_due_date": None,
                    },
                )

            else:

                await LoanRepository.update_loan(
                    loan_id=loan["id"],
                    update={
                        "payment_pending": True,
                        "pending_due_date": loan["next_due_date"],
                    },
                )

    @staticmethod
    async def missed_payment_check():
        """
        Runs every day at 12:05 AM.
        """

        today = datetime.now(timezone.utc).date()

        loans = await LoanRepository.get_active_loans()

        for loan in loans:

            if not loan.get("payment_pending", False):
                continue

            pending_due = loan.get("pending_due_date")

            if pending_due is None:
                continue

            missed_day = (
                pending_due + timedelta(days=7)
            ).date()

            if missed_day != today:
                continue

            await FineService.create_fine(
                fund_id=loan["fund_id"],
                loan_id=loan["id"],
                amount=500,
                reason="Missed Weekly Installment",
                created_by="SYSTEM",
            )

            await LoanRepository.update_loan(
                loan_id=loan["id"],
                update={
                    "payment_pending": False,
                    "pending_due_date": None,
                    "last_due_date": loan["next_due_date"],
                    "next_due_date": loan["next_due_date"] + timedelta(days=7),
                },
            )