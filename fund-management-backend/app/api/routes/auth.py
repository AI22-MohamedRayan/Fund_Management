from fastapi import APIRouter, status

from app.core.responses import success_response
from app.schemas.auth_schema import (
    LoginRequest,
    RegisterRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
async def register(
    request: RegisterRequest,
):

    user = await AuthService.register(
        name=request.name,
        phone=request.phone,
        password=request.password,
    )

    return success_response(
        message="User registered successfully.",
        data=user,
    )


@router.post("/login")
async def login(
    request: LoginRequest,
):

    result = await AuthService.login(
        phone=request.phone,
        password=request.password,
    )

    return success_response(
        message="Login successful.",
        data=result,
    )   