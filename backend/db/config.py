"""
DB engine + session setup.

Loads DATABASE_URL from .env and exposes:
- engine: SQLAlchemy engine
- SessionLocal: session factory
- get_db(): FastAPI-style dependency generator (Siddhi's API layer will use this too)
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://judge_user:judge_pass@localhost:5432/llm_judge_db",
)

engine = create_engine(DATABASE_URL, echo=False, future=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Yield a DB session, closing it after use. Usable as a FastAPI dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()