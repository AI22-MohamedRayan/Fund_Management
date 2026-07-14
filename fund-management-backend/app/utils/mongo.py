from bson import ObjectId


def serialize(document: dict | None):
    """
    Convert MongoDB document to JSON-friendly format.
    """
    if document is None:
        return None

    document["id"] = str(document.pop("_id"))

    return document


def serialize_list(documents: list):
    """
    Convert list of MongoDB documents.
    """
    return [serialize(document) for document in documents]