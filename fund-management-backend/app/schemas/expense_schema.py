# Expense schemas placeholder
from pydantic import BaseModel, ConfigDict, Field, field_validator


class CreateExpenseRequest(BaseModel):
    amount: int = Field(
        ...,
        gt=0,
        description="Expense Amount",
    )

    description: str = Field(
        ...,
        min_length=3,
        max_length=255,
    )

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, value: int):

        if value <= 0:
            raise ValueError(
                "Expense amount must be greater than zero."
            )

        return value


class ExpenseResponse(BaseModel):
    id: str

    fund_id: str

    amount: int

    description: str

    created_by: str

    created_at: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class ExpenseListResponse(BaseModel):
    id: str

    amount: int

    description: str

    created_by: str

    created_at: str

    model_config = ConfigDict(
        from_attributes=True,
    )