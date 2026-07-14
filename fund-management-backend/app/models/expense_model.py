# Expense model placeholder
from app.models.base_model import BaseModel


class ExpenseModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_id: str,
        amount: int,
        description: str,
        created_by: str,
    ):

        return {
            "fund_id": fund_id,

            "amount": amount,

            "description": description,

            "created_by": created_by,

            **BaseModel.timestamps(),
        }