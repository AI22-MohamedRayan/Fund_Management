from datetime import datetime, timezone


def timestamps():
    now = datetime.now(timezone.utc)
    return {
        "created_at": now,
        "updated_at": now,
    }


def update_timestamp():
    return {
        "updated_at": datetime.now(timezone.utc)
    }


class BaseModel:
    @staticmethod
    def timestamps():
        return timestamps()

    @staticmethod
    def update_timestamp():
        return update_timestamp()