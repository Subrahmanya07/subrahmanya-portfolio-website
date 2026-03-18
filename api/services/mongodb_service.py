import os
from datetime import datetime, timezone
from pymongo import MongoClient

_client = None


def get_client():
    global _client
    if _client is None:
        uri = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
        if not uri:
            raise ValueError("MONGO_URI environment variable not set")
        _client = MongoClient(uri)
    return _client


def get_portfolio_db():
    return get_client()[os.getenv("MONGODB_PORTFOLIO_DB", "portfolio")]


def get_rag_db():
    return get_client()[os.getenv("MONGODB_RAG_DB", "rag_db")]


async def save_contact(data: dict):
    db = get_portfolio_db()
    doc = {
        "name": data["name"],
        "email": data["email"],
        "subject": data.get("subject", "General"),
        "message": data["message"],
        "timestamp": datetime.now(timezone.utc),
        "read": False,
    }
    db.contacts.insert_one(doc)
    return True


async def vector_search(embedding: list[float], limit: int = 3):
    db = get_rag_db()
    try:
        results = db.documents.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": embedding,
                    "numCandidates": 50,
                    "limit": limit,
                }
            },
            {
                "$project": {
                    "text": 1,
                    "category": 1,
                    "metadata": 1,
                    "score": {"$meta": "vectorSearchScore"},
                }
            },
        ])
        return list(results)
    except Exception:
        return []
