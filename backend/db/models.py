"""
MongoDB collection helpers and document‑level CRUD.

Collections
-----------
models           – registered LLM models
evaluation_runs  – one doc per evaluation pipeline execution
scores           – per‑rubric score (linked to a run via run_id)
rubrics          – rubric definitions with prompt templates
"""

from datetime import datetime, timezone
from bson import ObjectId
from db import get_db


# ── Helpers ───────────────────────────────────────────────────────────────────

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _id_str(doc: dict) -> dict:
    """Convert ObjectId fields to strings for JSON serialisation."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if doc and "run_id" in doc and isinstance(doc["run_id"], ObjectId):
        doc["run_id"] = str(doc["run_id"])
    return doc


# ── Models ────────────────────────────────────────────────────────────────────

def get_models_col():
    return get_db()["models"]


def insert_model(model: dict) -> str:
    model.setdefault("created_at", _now())
    result = get_models_col().insert_one(model)
    return str(result.inserted_id)


def list_models() -> list[dict]:
    return [_id_str(m) for m in get_models_col().find()]


def get_model_by_id(model_id: str) -> dict | None:
    doc = get_models_col().find_one({"model_id": model_id})
    return _id_str(doc) if doc else None


# ── Rubrics ───────────────────────────────────────────────────────────────────

def get_rubrics_col():
    return get_db()["rubrics"]


def insert_rubric(rubric: dict) -> str:
    rubric.setdefault("created_at", _now())
    result = get_rubrics_col().insert_one(rubric)
    return str(result.inserted_id)


def list_rubrics(enabled_only: bool = False) -> list[dict]:
    filt = {"enabled": True} if enabled_only else {}
    return [_id_str(r) for r in get_rubrics_col().find(filt)]


def update_rubric(key: str, updates: dict) -> bool:
    result = get_rubrics_col().update_one({"key": key}, {"$set": updates})
    return result.modified_count > 0


# ── Evaluation Runs ──────────────────────────────────────────────────────────

def get_runs_col():
    return get_db()["evaluation_runs"]


def insert_run(run: dict) -> str:
    run.setdefault("created_at", _now())
    result = get_runs_col().insert_one(run)
    return str(result.inserted_id)


def list_runs(limit: int = 50, skip: int = 0) -> list[dict]:
    cursor = get_runs_col().find().sort("created_at", -1).skip(skip).limit(limit)
    return [_id_str(r) for r in cursor]


def get_run(run_id: str) -> dict | None:
    doc = get_runs_col().find_one({"_id": ObjectId(run_id)})
    return _id_str(doc) if doc else None


def count_runs() -> int:
    return get_runs_col().count_documents({})


# ── Scores ────────────────────────────────────────────────────────────────────

def get_scores_col():
    return get_db()["scores"]


def insert_scores(scores: list[dict]) -> list[str]:
    for s in scores:
        s.setdefault("created_at", _now())
    result = get_scores_col().insert_many(scores)
    return [str(i) for i in result.inserted_ids]


def get_scores_for_run(run_id: str) -> list[dict]:
    cursor = get_scores_col().find({"run_id": run_id})
    return [_id_str(s) for s in cursor]
