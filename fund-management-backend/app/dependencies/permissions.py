# Permissions dependency placeholder
from fastapi import Depends

from app.core.enums import Role
from app.core.exceptions import ForbiddenException
from app.dependencies.auth import get_current_user
from app.services.member_service import MemberService


async def require_super_admin(
    fund_id: str,
    current_user=Depends(get_current_user),
):

    member = await MemberService.get_member(
        fund_id=fund_id,
        user_id=current_user["id"],
    )

    if not member:
        raise ForbiddenException("You are not a member of this fund.")

    if member["role"] != Role.SUPER_ADMIN.value:
        raise ForbiddenException("Super Admin access required.")

    return current_user


async def require_admin(
    fund_id: str,
    current_user=Depends(get_current_user),
):

    member = await MemberService.get_member(
        fund_id=fund_id,
        user_id=current_user["id"],
    )

    if not member:
        raise ForbiddenException("You are not a member of this fund.")

    if member["role"] not in (
        Role.ADMIN.value,
        Role.SUPER_ADMIN.value,
    ):
        raise ForbiddenException("Admin access required.")

    return current_user