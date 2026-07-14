# Loans endpoints placeholder
from fastapi import APIRouter, Depends, status

from app.core.responses import success_response
from app.dependencies.permissions import require_admin
from app.schemas.loan_schema import CreateLoanRequest
from app.services.loan_service import LoanService

router = APIRouter(
    prefix="/funds/{fund_id}/loans",
    tags=["Loans"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_loan(
    fund_id: str,
    request: CreateLoanRequest,
    current_user=Depends(require_admin),
):

    loan = await LoanService.create_loan(
        fund_id=fund_id,
        member_id=request.member_id,
        loan_amount=request.loan_amount,
        created_by=current_user["id"],
    )

    return success_response(
        message="Loan created successfully.",
        data=loan,
    )


@router.get("")
async def get_all_loans(
    fund_id: str,
    current_user=Depends(require_admin),
):

    loans = await LoanService.get_all_loans(
        fund_id=fund_id,
    )

    return success_response(
        message="Loans fetched successfully.",
        data=loans,
    )


@router.get("/active")
async def get_active_loans(
    fund_id: str,
    current_user=Depends(require_admin),
):

    loans = await LoanService.get_active_loans(
        fund_id=fund_id,
    )

    return success_response(
        message="Active loans fetched successfully.",
        data=loans,
    )


@router.get("/member/{member_id}")
async def get_member_loans(
    fund_id: str,
    member_id: str,
    current_user=Depends(require_admin),
):

    loans = await LoanService.get_member_loans(
        fund_id=fund_id,
        member_id=member_id,
    )

    return success_response(
        message="Member loans fetched successfully.",
        data=loans,
    )


@router.get("/{loan_id}")
async def get_loan(
    fund_id: str,
    loan_id: str,
    current_user=Depends(require_admin),
):

    loan = await LoanService.get_loan(
        loan_id=loan_id,
    )

    return success_response(
        message="Loan fetched successfully.",
        data=loan,
    )