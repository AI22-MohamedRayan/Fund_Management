# Payments endpoints placeholder
from fastapi import APIRouter, Depends, status
from app.schemas.payment_schema import (
    RecordPaymentRequest,
    UpdatePaymentRequest,
)
from app.core.responses import success_response
from app.dependencies.permissions import require_admin
from app.schemas.payment_schema import RecordPaymentRequest
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/funds/{fund_id}/payments",
    tags=["Payments"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def record_payment(
    fund_id: str,
    request: RecordPaymentRequest,
    current_user=Depends(require_admin),
):

    payment = await PaymentService.record_payment(
        fund_id=fund_id,
        loan_id=request.loan_id,
        amount=request.amount,
        created_by=current_user["id"],
    )

    return success_response(
        message="Payment recorded successfully.",
        data=payment,
    )


@router.get("")
async def get_all_payments(
    fund_id: str,
    current_user=Depends(require_admin),
):

    payments = await PaymentService.get_all_payments(
        fund_id=fund_id,
    )

    return success_response(
        message="Payments fetched successfully.",
        data=payments,
    )


@router.get("/loan/{loan_id}")
async def get_loan_payments(
    fund_id: str,
    loan_id: str,
    current_user=Depends(require_admin),
):

    payments = await PaymentService.get_loan_payments(
        loan_id=loan_id,
    )

    return success_response(
        message="Loan payments fetched successfully.",
        data=payments,
    )


@router.get("/member/{member_id}")
async def get_member_payments(
    fund_id: str,
    member_id: str,
    current_user=Depends(require_admin),
):

    payments = await PaymentService.get_member_payments(
        fund_id=fund_id,
        member_id=member_id,
    )

    return success_response(
        message="Member payments fetched successfully.",
        data=payments,
    )


@router.get("/{payment_id}")
async def get_payment(
    fund_id: str,
    payment_id: str,
    current_user=Depends(require_admin),
):

    payment = await PaymentService.get_payment(
        payment_id=payment_id,
    )

    return success_response(
        message="Payment fetched successfully.",
        data=payment,
    )

@router.patch("/{payment_id}")
async def update_payment(
    fund_id: str,
    payment_id: str,
    request: UpdatePaymentRequest,
    current_user=Depends(require_admin),
):

    payment = await PaymentService.update_payment(
        payment_id=payment_id,
        amount=request.amount,
        updated_by=current_user["id"],
    )

    return success_response(
        message="Payment updated successfully.",
        data=payment,
    )