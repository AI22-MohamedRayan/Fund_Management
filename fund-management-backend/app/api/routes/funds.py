from fastapi import APIRouter, Depends, status

from app.core.responses import success_response
from app.dependencies.auth import get_current_user
from app.schemas.fund_schema import CreateFundRequest
from app.services.balance_service import BalanceService
from app.services.fund_service import FundService

router = APIRouter(
    prefix="/funds",
    tags=["Funds"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_fund(
    request: CreateFundRequest,
    current_user=Depends(get_current_user),
):

    fund = await FundService.create_fund(
        fund_name=request.fund_name,
        contribution_amount=request.contribution_amount,
        previous_balance=request.previous_balance,
        super_admin_password=request.super_admin_password,
        created_by=current_user["id"],
    )

    return success_response(
        message="Fund created successfully.",
        data=fund,
    )


@router.get("")
async def get_funds():

    funds = await FundService.get_all_funds()

    return success_response(
        message="Funds fetched successfully.",
        data=funds,
    )


@router.get("/{fund_id}")
async def get_fund(
    fund_id: str,
):

    fund = await FundService.get_fund_by_id(
        fund_id=fund_id,
    )

    return success_response(
        message="Fund fetched successfully.",
        data=fund,
    )


@router.get("/{fund_id}/balance")
async def get_balance(
    fund_id: str,
):

    balance = await BalanceService.get_current_balance(
        fund_id=fund_id,
    )

    return success_response(
        message="Current balance fetched successfully.",
        data={
            "current_balance": balance
        },
    )