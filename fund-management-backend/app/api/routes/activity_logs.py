# Activity logs endpoints placeholder
from fastapi import APIRouter, Depends, Query

from app.core.enums import ActivityAction
from app.core.responses import success_response
from app.dependencies.permissions import require_admin
from app.services.activity_service import ActivityService

router = APIRouter(
    prefix="/funds/{fund_id}/activity-logs",
    tags=["Activity Logs"],
)


@router.get("")
async def get_activity_logs(
    fund_id: str,
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_user=Depends(require_admin),
):

    logs = await ActivityService.get_logs(
        fund_id=fund_id,
        limit=limit,
        skip=skip,
    )

    return success_response(
        message="Activity logs fetched successfully.",
        data=logs,
    )


@router.get("/action/{action}")
async def get_logs_by_action(
    fund_id: str,
    action: ActivityAction,
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_user=Depends(require_admin),
):

    logs = await ActivityService.get_logs_by_action(
        fund_id=fund_id,
        action=action,
        limit=limit,
        skip=skip,
    )

    return success_response(
        message="Activity logs fetched successfully.",
        data=logs,
    )


@router.get("/member/{member_id}")
async def get_member_logs(
    fund_id: str,
    member_id: str,
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_user=Depends(require_admin),
):

    logs = await ActivityService.get_member_logs(
        fund_id=fund_id,
        member_id=member_id,
        limit=limit,
        skip=skip,
    )

    return success_response(
        message="Member activity logs fetched successfully.",
        data=logs,
    )


@router.get("/admin/{admin_id}")
async def get_admin_logs(
    fund_id: str,
    admin_id: str,
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_user=Depends(require_admin),
):

    logs = await ActivityService.get_admin_logs(
        fund_id=fund_id,
        admin_id=admin_id,
        limit=limit,
        skip=skip,
    )

    return success_response(
        message="Admin activity logs fetched successfully.",
        data=logs,
    )