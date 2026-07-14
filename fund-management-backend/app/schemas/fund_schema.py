# Fund schemas placeholder
from pydantic import BaseModel, Field, field_validator


class CreateFundRequest(BaseModel):
    fund_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )

    contribution_amount: int = Field(...)

    previous_balance: int = Field(
        default=0,
        ge=0,
    )

    super_admin_password: str

    @field_validator("contribution_amount")
    @classmethod
    def validate_contribution(cls, value: int):

        if value <= 0:
            raise ValueError(
                "Contribution amount must be greater than zero."
            )

        if value % 100 != 0:
            raise ValueError(
                "Contribution amount must be a multiple of ₹100."
            )

        return value


class FundResponse(BaseModel):
    id: str
    fund_name: str
    contribution_amount: int
    opening_balance: int