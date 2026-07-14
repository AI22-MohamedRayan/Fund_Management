# Dashboard endpoints placeholder
from fastapi import APIRouter, Depends

from app.core.responses import success_response
from app.dependencies.permissions import require_admin
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/funds/{fund_id}/dashboard",
    tags=["Dashboard"],
)


@router.get("")
async def get_dashboard(
    fund_id: str,
    current_user=Depends(require_admin),
):

    dashboard = await DashboardService.get_dashboard(
        fund_id=fund_id,
    )

    return success_response(
        message="Dashboard fetched successfully.",
        data=dashboard,
    )