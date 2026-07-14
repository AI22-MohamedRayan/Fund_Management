# Member model placeholder
from app.core.enums import (
    MemberStatus,
    Role,
)

from app.models.base_model import BaseModel


class FundMemberModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_id: str,
        user_id: str,
        role: Role,
        contribution_paid: bool,
        contribution_transaction_id: str | None = None,
    ):

        return {

            "fund_id": fund_id,

            "user_id": user_id,

            "role": role.value,

            "contribution_paid": contribution_paid,

            "contribution_transaction_id": contribution_transaction_id,

            "status": MemberStatus.ACTIVE.value,

            "joined_at": BaseModel.timestamps()["created_at"],

            **BaseModel.timestamps(),
        }