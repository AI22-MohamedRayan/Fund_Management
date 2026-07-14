# Payment schemas placeholder
from pydantic import BaseModel, ConfigDict, Field, field_validator


class RecordPaymentRequest(BaseModel):
    loan_id: str = Field(
        ...,
        description="Loan ID",
    )

    amount: int = Field(
        ...,
        gt=0,
        description="Payment Amount",
    )

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, value: int):

        if value <= 0:
            raise ValueError(
                "Payment amount must be greater than zero."
            )

        return value

class UpdatePaymentRequest(BaseModel):
    amount: int = Field(
        ...,
        gt=0,
        description="Updated Payment Amount",
    )

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, value):

        if value <= 0:
            raise ValueError(
                "Payment amount must be greater than zero."
            )

        return value

class PaymentResponse(BaseModel):
    id: str

    fund_id: str

    loan_id: str

    member_id: str

    amount: int

    remaining_amount: int

    payment_date: str

    created_by: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class PaymentListResponse(BaseModel):
    id: str

    loan_id: str

    member_id: str

    amount: int

    payment_date: str

    created_by: str

    model_config = ConfigDict(
        from_attributes=True,
    )