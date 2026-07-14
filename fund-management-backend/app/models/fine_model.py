# Fine model placeholder
from app.core.enums import FineStatus
from app.models.base_model import BaseModel


class FineModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_id: str,
        loan_id: str,
        member_id: str,
        amount: int,
        reason: str,
        created_by: str,
    ):

        return {
            "fund_id": fund_id,

            "loan_id": loan_id,

            "member_id": member_id,

            "amount": amount,

            "reason": reason,

            "status": FineStatus.ACTIVE.value,

            "created_by": created_by,

            **BaseModel.timestamps(),
        }