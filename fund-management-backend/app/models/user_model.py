# User model placeholder
from app.models.base_model import BaseModel


class UserModel(BaseModel):

    @staticmethod
    def create(
        *,
        name: str,
        phone: str,
        password: str,
    ):

        return {
            "name": name.strip(),
            "phone": phone,
            "password": password,
            **BaseModel.timestamps(),
        }
        