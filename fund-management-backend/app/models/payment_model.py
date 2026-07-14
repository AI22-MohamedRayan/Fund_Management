from app.core.enums import PaymentStatus
from app.models.base_model import BaseModel


class PaymentModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_id: str,
        loan_id: str,
        member_id: str,
        amount: int,
        remaining_amount: int,
        payment_date,
        created_by: str,
    ):

        return {
            "fund_id": fund_id,

            "loan_id": loan_id,

            "member_id": member_id,

            "amount": amount,

            "remaining_amount": remaining_amount,

            "payment_date": payment_date,

            "created_by": created_by,

            "status": PaymentStatus.ACTIVE.value,

            "reversed": False,

            "reversed_at": None,

            "reversed_by": None,

            "reverse_reason": None,

            **BaseModel.timestamps(),
        }