# Fines endpoints placeholder
from fastapi import APIRouter, Depends, status

from app.core.responses import success_response
from app.dependencies.permissions import require_admin
from app.schemas.fine_schema import (
    CancelFineRequest,
    CreateFineRequest,
)
from app.services.fine_service import FineService

router = APIRouter(
    prefix="/funds/{fund_id}/fines",
    tags=["Fines"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_fine(
    fund_id: str,
    request: CreateFineRequest,
    current_user=Depends(require_admin),
):

    fine = await FineService.create_fine(
        fund_id=fund_id,
        loan_id=request.loan_id,
        amount=request.amount,
        reason=request.reason,
        created_by=current_user["id"],
    )

    return success_response(
        message="Fine created successfully.",
        data=fine,
    )


@router.patch("/{fine_id}/cancel")
async def cancel_fine(
    fund_id: str,
    fine_id: str,
    request: CancelFineRequest,
    current_user=Depends(require_admin),
):

    fine = await FineService.cancel_fine(
        fine_id=fine_id,
        reason=request.reason,
        cancelled_by=current_user["id"],
    )

    return success_response(
        message="Fine cancelled successfully.",
        data=fine,
    )


@router.get("")
async def get_all_fines(
    fund_id: str,
    current_user=Depends(require_admin),
):

    fines = await FineService.get_all_fines(
        fund_id=fund_id,
    )

    return success_response(
        message="Fines fetched successfully.",
        data=fines,
    )


@router.get("/active")
async def get_active_fines(
    fund_id: str,
    current_user=Depends(require_admin),
):

    fines = await FineService.get_active_fines(
        fund_id=fund_id,
    )

    return success_response(
        message="Active fines fetched successfully.",
        data=fines,
    )


@router.get("/member/{member_id}")
async def get_member_fines(
    fund_id: str,
    member_id: str,
    current_user=Depends(require_admin),
):

    fines = await FineService.get_member_fines(
        fund_id=fund_id,
        member_id=member_id,
    )

    return success_response(
        message="Member fines fetched successfully.",
        data=fines,
    )


@router.get("/loan/{loan_id}")
async def get_loan_fines(
    fund_id: str,
    loan_id: str,
    current_user=Depends(require_admin),
):

    fines = await FineService.get_loan_fines(
        loan_id=loan_id,
    )

    return success_response(
        message="Loan fines fetched successfully.",
        data=fines,
    )


@router.get("/{fine_id}")
async def get_fine(
    fund_id: str,
    fine_id: str,
    current_user=Depends(require_admin),
):

    fine = await FineService.get_fine(
        fine_id=fine_id,
    )

    return success_response(
        message="Fine fetched successfully.",
        data=fine,
    )