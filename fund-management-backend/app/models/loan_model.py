from datetime import datetime, timedelta

from app.core.enums import LoanStatus
from app.models.base_model import BaseModel


class LoanModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_id: str,
        member_id: str,
        principal_amount: int,
        interest: int,
        disbursed_amount: int,
        outstanding_amount: int,
        weekly_minimum: int,
        loan_date: datetime,
        created_by: str,
    ):

        # Repayment starts after one full week
        first_due_date = loan_date + timedelta(days=8)

        return {
            "fund_id": fund_id,
            "member_id": member_id,

            "principal_amount": principal_amount,
            "interest": interest,
            "disbursed_amount": disbursed_amount,
            "outstanding_amount": outstanding_amount,

            "weekly_minimum": weekly_minimum,

            "loan_date": loan_date,

            "repayment_day": first_due_date.strftime("%A").upper(),

            "first_due_date": first_due_date,
            "last_due_date": None,
            "next_due_date": first_due_date,

            # Scheduler
            "payment_pending": False,
            "pending_due_date": None,

            "status": LoanStatus.ACTIVE.value,

            "created_by": created_by,

            **BaseModel.timestamps(),
        }