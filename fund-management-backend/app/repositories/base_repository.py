from bson import ObjectId

from app.config.database import get_database
from app.utils.mongo import serialize, serialize_list


class BaseRepository:
    collection_name = None

    @classmethod
    def collection(cls):
        db = get_database()
        return db[cls.collection_name]

    @classmethod
    async def create(cls, document: dict, session=None):

        result = await cls.collection().insert_one(
            document,
            session=session,
        )

        created = await cls.collection().find_one(
            {
                "_id": result.inserted_id
            },
            session=session,
        )

        return serialize(created)

    @classmethod
    async def insert_many(cls, documents: list, session=None):

        return await cls.collection().insert_many(
            documents,
            session=session,
        )

    @classmethod
    async def get_by_id(cls, document_id: str, session=None):

        document = await cls.collection().find_one(
            {
                "_id": ObjectId(document_id)
            },
            session=session,
        )

        return serialize(document)

    @classmethod
    async def find_one(cls, query: dict, session=None, sort: list | None = None):

        if sort is None:
            document = await cls.collection().find_one(
                query,
                session=session,
            )
        else:
            cursor = cls.collection().find(
                query,
                session=session,
            ).sort(sort).limit(1)
            documents = await cursor.to_list(length=1)
            document = documents[0] if documents else None

        return serialize(document)

    @classmethod
    async def find_many(
        cls,
        query: dict | None = None,
        limit: int = 100,
        skip: int = 0,
        sort: list | None = None,
        session=None,
    ):

        query = query or {}

        cursor = cls.collection().find(
            query,
            session=session,
        )

        if sort:
            cursor = cursor.sort(sort)

        cursor = cursor.skip(skip).limit(limit)

        documents = await cursor.to_list(length=limit)

        return serialize_list(documents)

    @classmethod
    async def update_one(
        cls,
        query: dict,
        update: dict,
        session=None,
    ):

        await cls.collection().update_one(
            query,
            {
                "$set": update
            },
            session=session,
        )

        document = await cls.collection().find_one(
            query,
            session=session,
        )

        return serialize(document)

    @classmethod
    async def update_many(
        cls,
        query: dict,
        update: dict,
        session=None,
    ):

        return await cls.collection().update_many(
            query,
            {
                "$set": update
            },
            session=session,
        )

    @classmethod
    async def delete_one(
        cls,
        query: dict,
        session=None,
    ):

        return await cls.collection().delete_one(
            query,
            session=session,
        )

    @classmethod
    async def exists(
        cls,
        query: dict,
        session=None,
    ):

        return (
            await cls.collection().find_one(
                query,
                session=session,
            )
            is not None
        )

    @classmethod
    async def count(
        cls,
        query: dict | None = None,
        session=None,
    ):

        query = query or {}

        return await cls.collection().count_documents(
            query,
            session=session,
        )

    @classmethod
    async def aggregate(
        cls,
        pipeline: list,
        session=None,
    ):

        cursor = cls.collection().aggregate(
            pipeline,
            session=session,
        )

        return await cursor.to_list(length=None)