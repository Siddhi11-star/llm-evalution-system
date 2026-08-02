"""
Relevance judge agent.
Fetches the Relevance rubric's prompt_template from the DB, fills in the
task/output, and calls the shared judge_client (Groq -> Gemini fallback).
"""

from backend.db.config import SessionLocal
from backend.db.models import Rubric
from backend.agents.judge_client import call_judge


def get_relevance_rubric_template() -> str:
    db = SessionLocal()
    try:
        rubric = db.query(Rubric).filter_by(name="Relevance").first()
        if not rubric:
            raise RuntimeError("Relevance rubric not found — did you run the seed script?")
        return rubric.prompt_template
    finally:
        db.close()


def judge_relevance(task_description: str, output_text: str) -> dict:
    template = get_relevance_rubric_template()
    prompt = template.format(task_description=task_description, output_text=output_text)
    return call_judge(prompt)


if __name__ == "__main__":
    result = judge_relevance(
        task_description="What's a good recipe for chocolate chip cookies?",
        output_text="The history of chocolate dates back to ancient Mesoamerica, where cacao was used in ceremonial drinks.",
    )
    print(result)