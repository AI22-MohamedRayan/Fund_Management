from app.config.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.core.exceptions import (
    ConflictException,
    UnauthorizedException,
)
from app.models.base_model import timestamps
from app.repositories.user_repository import UserRepository


class AuthService:

    @staticmethod
    async def register(
        name: str,
        phone: str,
        password: str,
    ):

        existing_user = await UserRepository.get_by_phone(phone)

        if existing_user:
            raise ConflictException(
                "Phone number is already registered."
            )

        user = {
            "name": name.strip(),
            "phone": phone,
            "password": hash_password(password),
            **timestamps(),
        }

        created_user = await UserRepository.create(user)

        created_user.pop("password", None)

        return created_user

    @staticmethod
    async def login(
        phone: str,
        password: str,
    ):

        user = await UserRepository.get_by_phone(phone)

        if not user:
            raise UnauthorizedException(
                "Invalid phone number or password."
            )

        if not verify_password(
            password,
            user["password"],
        ):
            raise UnauthorizedException(
                "Invalid phone number or password."
            )

        token = create_access_token(
            {
                "sub": user["id"],
                "phone": user["phone"],
            }
        )

        response_user = {
            "id": user["id"],
            "name": user["name"],
            "phone": user["phone"],
        }

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": response_user,
        }