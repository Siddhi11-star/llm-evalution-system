"""
Flask API routes — /api/v1/*

Endpoints
---------
POST   /evaluate             Run the full judge pipeline on a task+output
GET    /evaluations          List past evaluation runs
GET    /evaluations/<id>     Get a single run with rubric scores
GET    /models               List registered LLM models
GET    /rubrics              List rubric configs
PUT    /rubrics/<key>        Update a rubric's prompt / weight / enabled flag
GET    /dashboard/stats      Aggregated stats for the dashboard
GET    /health               Health check
"""

from __future__ import annotations

import logging
from flask import Blueprint, jsonify, request

from db.models import (
    list_models,
    get_model_by_id,
    list_rubrics,
    update_rubric,
    insert_run,
    list_runs,
    get_run,
    count_runs,
    insert_scores,
    get_scores_for_run,
)
from orchestration.graph import run_evaluation, ALL_JUDGES

logger = logging.getLogger(__name__)
api_bp = Blueprint("api", __name__)


# ── Health ────────────────────────────────────────────────────────────────────

@api_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


# ── Models ────────────────────────────────────────────────────────────────────

@api_bp.route("/models", methods=["GET"])
def get_models():
    return jsonify(list_models())


# ── Rubrics ───────────────────────────────────────────────────────────────────

@api_bp.route("/rubrics", methods=["GET"])
def get_rubrics():
    return jsonify(list_rubrics())


@api_bp.route("/rubrics/<key>", methods=["PUT"])
def put_rubric(key: str):
    body = request.get_json(force=True)
    allowed = {"prompt_template", "weight", "enabled", "label"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400
    ok = update_rubric(key, updates)
    if not ok:
        return jsonify({"error": f"Rubric '{key}' not found"}), 404
    return jsonify({"status": "updated", "key": key})


# ── Evaluations ───────────────────────────────────────────────────────────────

@api_bp.route("/evaluations", methods=["GET"])
def get_evaluations():
    limit = request.args.get("limit", 50, type=int)
    skip = request.args.get("skip", 0, type=int)
    runs = list_runs(limit=limit, skip=skip)
    return jsonify(runs)


@api_bp.route("/evaluations/<run_id>", methods=["GET"])
def get_evaluation_detail(run_id: str):
    run = get_run(run_id)
    if not run:
        return jsonify({"error": "Run not found"}), 404
    scores = get_scores_for_run(run_id)
    run["scores"] = scores
    return jsonify(run)


# ── Run Evaluation Pipeline ──────────────────────────────────────────────────

@api_bp.route("/evaluate", methods=["POST"])
def evaluate():
    """
    Submit a task + output for evaluation.

    Request body:
    {
        "task_description": "...",
        "output_text": "...",
        "model_id": "gpt-4o",
        "rubrics": ["accuracy","relevance",...]   // optional, defaults to all enabled
    }
    """
    body = request.get_json(force=True)
    task_description = body.get("task_description")
    output_text = body.get("output_text")
    model_id = body.get("model_id")

    if not task_description or not output_text or not model_id:
        return jsonify({
            "error": "Missing required fields: task_description, output_text, model_id"
        }), 400

    # Determine which rubrics to run
    requested_rubrics = body.get("rubrics")
    if requested_rubrics:
        enabled_rubrics = [r for r in requested_rubrics if r in ALL_JUDGES]
    else:
        # Default: all rubrics enabled in the DB
        db_rubrics = list_rubrics(enabled_only=True)
        enabled_rubrics = [r["key"] for r in db_rubrics if r["key"] in ALL_JUDGES]

    if not enabled_rubrics:
        enabled_rubrics = list(ALL_JUDGES.keys())

    # Run the LangGraph pipeline
    try:
        eval_result = run_evaluation({
            "task_description": task_description,
            "output_text": output_text,
            "model_id": model_id,
            "enabled_rubrics": enabled_rubrics,
        })
    except RuntimeError as exc:
        logger.error("Evaluation pipeline failed: %s", exc)
        return jsonify({"error": str(exc)}), 503

    # Persist to MongoDB
    run_doc = {
        "task_description": task_description,
        "output_text": output_text,
        "model_id": model_id,
        "overall_score": eval_result.overall_score,
        "status": eval_result.status,
        "judges_count": eval_result.judges_count,
    }
    run_id = insert_run(run_doc)

    score_docs = []
    for s in eval_result.scores:
        score_docs.append({
            "run_id": run_id,
            "rubric": s["rubric"],
            "score_value": s["score_value"],
            "reasoning": s["reasoning"],
            "judge_model_used": s.get("judge_model_used", ""),
            "provider": s.get("provider", ""),
        })
    if score_docs:
        insert_scores(score_docs)

    response = eval_result.to_dict()
    response["_id"] = run_id
    return jsonify(response), 201


# ── Dashboard Stats ──────────────────────────────────────────────────────────

@api_bp.route("/dashboard/stats", methods=["GET"])
def dashboard_stats():
    """Return aggregated stats for the dashboard overview cards."""
    models = list_models()
    rubrics = list_rubrics()
    total_runs = count_runs()

    return jsonify({
        "active_models": len(models),
        "total_rubrics": len(rubrics),
        "total_evaluations": total_runs,
    })
