# Member schemas placeholder
from pydantic import BaseModel, ConfigDict, Field


class AddMemberRequest(BaseModel):
    user_id: str = Field(
        ...,
        description="Registered user ID",
    )


class UpdateRoleRequest(BaseModel):
    user_id: str

    role: str = Field(
        ...,
        pattern="^(ADMIN|MEMBER)$",
    )


class MemberResponse(BaseModel):
    id: str
    fund_id: str
    user_id: str
    role: str
    contribution_paid: bool
    contribution_transaction_id: str | None = None
    status: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class UserSearchResponse(BaseModel):
    id: str
    name: str
    phone: str

    model_config = ConfigDict(
        from_attributes=True,
    )