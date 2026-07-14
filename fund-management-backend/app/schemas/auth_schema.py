# Authentication schemas placeholder
from pydantic import BaseModel, Field, ConfigDict


# ===========================
# Register
# ===========================

class RegisterRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Full Name"
    )

    phone: str = Field(
        ...,
        min_length=10,
        max_length=10,
        pattern=r"^[6-9]\d{9}$",
        description="Indian Mobile Number"
    )

    password: str = Field(
        ...,
        min_length=6,
        max_length=50
    )


# ===========================
# Login
# ===========================

class LoginRequest(BaseModel):
    phone: str = Field(
        ...,
        min_length=10,
        max_length=10,
        pattern=r"^[6-9]\d{9}$"
    )

    password: str


# ===========================
# User Response
# ===========================

class UserResponse(BaseModel):
    id: str
    name: str
    phone: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ===========================
# Login Response
# ===========================

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse