# Activity model placeholder
from app.models.base_model import BaseModel
from app.core.enums import ActivityAction


class ActivityModel(BaseModel):

    @staticmethod
    def create(
        *,
        fund_id: str,
        action: ActivityAction,
        admin_id: str,
        member_id: str | None = None,
        old_value: dict | None = None,
        new_value: dict | None = None,
    ):

        return {

            "fund_id": fund_id,

            "action": action.value,

            "admin_id": admin_id,

            "member_id": member_id,

            "old_value": old_value,

            "new_value": new_value,

            **BaseModel.timestamps(),
        }