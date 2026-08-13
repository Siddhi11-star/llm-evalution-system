"""
Database package — PyMongo client initialisation.
"""

from pymongo import MongoClient
from config import cfg

_client: MongoClient | None = None


def get_client() -> MongoClient:
    """Return a singleton MongoClient."""
    global _client
    if _client is None:
        _client = MongoClient(cfg.MONGO_URI)
    return _client


def get_db():
    """Return the application database handle."""
    return get_client()[cfg.MONGO_DB]
