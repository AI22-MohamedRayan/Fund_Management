# Fine schemas placeholder
from pydantic import BaseModel, ConfigDict, Field


class CreateFineRequest(BaseModel):
    loan_id: str = Field(
        ...,
        description="Loan ID",
    )

    amount: int = Field(
        ...,
        gt=0,
        description="Fine Amount",
    )

    reason: str = Field(
        ...,
        min_length=3,
        max_length=255,
    )


class CancelFineRequest(BaseModel):
    reason: str = Field(
        ...,
        min_length=3,
        max_length=255,
    )


class FineResponse(BaseModel):
    id: str

    fund_id: str

    loan_id: str

    member_id: str

    amount: int

    reason: str

    status: str

    created_by: str

    created_at: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class FineListResponse(BaseModel):
    id: str

    member_id: str

    amount: int

    reason: str

    status: str

    created_at: str

    model_config = ConfigDict(
        from_attributes=True,
    )