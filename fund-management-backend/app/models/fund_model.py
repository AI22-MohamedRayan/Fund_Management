# Fund model placeholder
from app.models.base_model import BaseModel


class FundModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_name: str,
        contribution_amount: int,
        opening_balance: int,
        created_by: str,
    ):

        return {
            "fund_name": fund_name.strip(),

            "contribution_amount": contribution_amount,

            "opening_balance": opening_balance,

            "created_by": created_by,

            "is_active": True,

            **BaseModel.timestamps(),
        }