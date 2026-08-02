"""
Seed script: populates `models` and `rubrics` tables with starter data.

Run with:
    python -m backend.db.seed

Safe to re-run — it checks for existing rows by name/provider before inserting,
so it won't create duplicates.
"""

from backend.db.config import SessionLocal
from backend.db.models import Model, Rubric


# ---------------------------------------------------------------------------
# Models — one per provider in the locked stack, to start
# ---------------------------------------------------------------------------

MODELS = [
    {
        "name": "llama-3.3-70b-versatile",
        "provider": "groq",
        "cost_per_1k_tokens": 0.00059,
        "avg_latency_ms": 400,
    },
    {
        "name": "gemini-2.0-flash",
        "provider": "gemini",
        "cost_per_1k_tokens": 0.0001,
        "avg_latency_ms": 350,
    },
    {
        "name": "unitary/toxic-bert",
        "provider": "huggingface",
        "cost_per_1k_tokens": 0.0,
        "avg_latency_ms": 600,
    },
    {
        "name": "llama3.1:8b",
        "provider": "ollama",
        "cost_per_1k_tokens": 0.0,
        "avg_latency_ms": 1200,
    },
]


# ---------------------------------------------------------------------------
# Rubrics — Accuracy, Hallucination, Relevance to start
# (Reasoning, Safety, Style come later per the build order)
# ---------------------------------------------------------------------------

RUBRICS = [
    {
        "name": "Accuracy",
        "description": "Measures whether the output's factual claims are correct and verifiable.",
        "prompt_template": (
            "You are an expert evaluator judging the ACCURACY of an AI-generated response.\n\n"
            "Task given to the model:\n{task_description}\n\n"
            "Model's output:\n{output_text}\n\n"
            "Evaluate the factual correctness of the output. Check for:\n"
            "- Incorrect facts, figures, or claims\n"
            "- Outdated or superseded information\n"
            "- Internal inconsistencies\n\n"
            "Respond ONLY in this JSON format:\n"
            "{{\n"
            '  "score": <float 0-10, where 10 is fully accurate>,\n'
            '  "reasoning": "<concise explanation, 1-3 sentences>"\n'
            "}}"
        ),
    },
    {
        "name": "Hallucination",
        "description": "Detects fabricated information not supported by the task context or verifiable facts.",
        "prompt_template": (
            "You are an expert evaluator judging HALLUCINATION in an AI-generated response.\n\n"
            "Task given to the model:\n{task_description}\n\n"
            "Model's output:\n{output_text}\n\n"
            "Identify any content that is fabricated, invented, or not grounded in the "
            "task context or verifiable reality — including invented sources, fake "
            "statistics, made-up names/events, or unsupported specific claims.\n\n"
            "Respond ONLY in this JSON format:\n"
            "{{\n"
            '  "score": <float 0-10, where 10 means NO hallucination detected>,\n'
            '  "reasoning": "<concise explanation, 1-3 sentences, cite the specific '
            'fabricated content if any>"\n'
            "}}"
        ),
    },
    {
        "name": "Relevance",
        "description": "Measures how directly and completely the output addresses the given task.",
        "prompt_template": (
            "You are an expert evaluator judging the RELEVANCE of an AI-generated response.\n\n"
            "Task given to the model:\n{task_description}\n\n"
            "Model's output:\n{output_text}\n\n"
            "Evaluate how well the output addresses the task. Check for:\n"
            "- Whether it directly answers what was asked\n"
            "- Unnecessary tangents or missing key parts of the request\n"
            "- Whether the scope matches what was requested (not too narrow/broad)\n\n"
            "Respond ONLY in this JSON format:\n"
            "{{\n"
            '  "score": <float 0-10, where 10 is fully relevant and complete>,\n'
            '  "reasoning": "<concise explanation, 1-3 sentences>"\n'
            "}}"
        ),
    },
]


def seed():
    db = SessionLocal()
    try:
        added_models = 0
        for m in MODELS:
            exists = (
                db.query(Model)
                .filter_by(name=m["name"], provider=m["provider"])
                .first()
            )
            if not exists:
                db.add(Model(**m))
                added_models += 1

        added_rubrics = 0
        for r in RUBRICS:
            exists = db.query(Rubric).filter_by(name=r["name"]).first()
            if not exists:
                db.add(Rubric(**r))
                added_rubrics += 1

        db.commit()
        print(f"Seed complete: {added_models} model(s) added, {added_rubrics} rubric(s) added.")

        if added_models == 0 and added_rubrics == 0:
            print("Nothing new to add — all rows already existed.")

    except Exception as e:
        db.rollback()
        print(f"Seed failed, rolled back: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()