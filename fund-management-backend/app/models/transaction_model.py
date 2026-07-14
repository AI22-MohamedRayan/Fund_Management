# Transaction model placeholder
from app.models.base_model import BaseModel
from app.core.enums import TransactionType


class FundTransactionModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_id: str,
        transaction_type: TransactionType,
        amount: int,
        created_by: str,
        member_id: str | None = None,
        reference_id: str | None = None,
        remarks: str | None = None,
    ):

        return {

            "fund_id": fund_id,

            "transaction_type": transaction_type.value,

            "amount": amount,

            "member_id": member_id,

            "reference_id": reference_id,

            "remarks": remarks,

            "created_by": created_by,

            **BaseModel.timestamps(),
        }