from fastapi import APIRouter, Depends

from app.core.responses import success_response
from app.dependencies.auth import get_current_user
from app.services.public_ledger_service import PublicLedgerService

router = APIRouter(
    prefix="/funds/{fund_id}/ledger",
    tags=["Public Ledger"],
)


@router.get("")
async def get_public_ledger(
    fund_id: str,
    current_user=Depends(get_current_user),
):

    ledger = await PublicLedgerService.get_public_ledger(
        fund_id=fund_id,
    )

    return success_response(
        message="Public ledger fetched successfully.",
        data=ledger,
    )