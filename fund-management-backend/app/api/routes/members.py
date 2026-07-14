# Members endpoints placeholder
from fastapi import APIRouter, Depends, Query, status

from app.core.enums import Role
from app.core.responses import success_response
from app.dependencies.permissions import require_super_admin
from app.schemas.member_schema import (
    AddMemberRequest,
    UpdateRoleRequest,
)
from app.services.member_service import MemberService

router = APIRouter(
    prefix="/funds/{fund_id}/members",
    tags=["Members"],
)


@router.get("")
async def get_members(
    fund_id: str,
    current_user=Depends(require_super_admin),
):

    members = await MemberService.get_members(
        fund_id=fund_id,
    )

    return success_response(
        message="Members fetched successfully.",
        data=members,
    )


@router.get("/search")
async def search_users(
    fund_id: str,
    search: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    current_user=Depends(require_super_admin),
):

    users = await MemberService.search_users(
        search=search,
        limit=limit,
    )

    return success_response(
        message="Users fetched successfully.",
        data=users,
    )


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def add_member(
    fund_id: str,
    request: AddMemberRequest,
    current_user=Depends(require_super_admin),
):

    member = await MemberService.add_member(
        fund_id=fund_id,
        user_id=request.user_id,
        created_by=current_user["id"],
        contribution_paid=False,
    )

    return success_response(
        message="Member added successfully.",
        data=member,
    )


@router.patch("/role")
async def update_role(
    fund_id: str,
    request: UpdateRoleRequest,
    current_user=Depends(require_super_admin),
):

    member = await MemberService.update_role(
        fund_id=fund_id,
        user_id=request.user_id,
        role=Role(request.role),
    )

    return success_response(
        message="Member role updated successfully.",
        data=member,
    )