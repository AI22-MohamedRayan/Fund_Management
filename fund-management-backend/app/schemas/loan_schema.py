# Loan schemas placeholder
from pydantic import BaseModel, ConfigDict, Field, field_validator


class CreateLoanRequest(BaseModel):
    member_id: str = Field(
        ...,
        description="Fund Member ID",
    )

    loan_amount: int = Field(
        ...,
        description="Loan Amount",
    )

    @field_validator("loan_amount")
    @classmethod
    def validate_loan_amount(cls, value: int):

        allowed_amounts = [5000, 10000, 15000, 20000]

        if value not in allowed_amounts:
            raise ValueError(
                "Loan amount must be one of: ₹5000, ₹10000, ₹15000 or ₹20000."
            )

        return value


class LoanResponse(BaseModel):
    id: str
    fund_id: str
    member_id: str

    principal_amount: int

    interest: int

    disbursed_amount: int

    outstanding_amount: int

    weekly_minimum: int

    loan_date: str

    first_due_date: str

    next_due_date: str

    status: str

    created_by: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class LoanListResponse(BaseModel):
    id: str
    member_id: str

    principal_amount: int

    outstanding_amount: int

    next_due_date: str

    status: str

    model_config = ConfigDict(
        from_attributes=True,
    )