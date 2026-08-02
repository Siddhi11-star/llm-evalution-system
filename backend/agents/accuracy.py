"""
Accuracy judge agent.

Fetches the Accuracy rubric's prompt_template from the DB, fills in the
task/output, and calls the shared judge_client (Groq -> Gemini fallback).
"""

from backend.db.config import SessionLocal
from backend.db.models import Rubric
from backend.agents.judge_client import call_judge


def get_accuracy_rubric_template() -> str:
    db = SessionLocal()
    try:
        rubric = db.query(Rubric).filter_by(name="Accuracy").first()
        if not rubric:
            raise RuntimeError("Accuracy rubric not found — did you run the seed script?")
        return rubric.prompt_template
    finally:
        db.close()


def judge_accuracy(task_description: str, output_text: str) -> dict:
    """
    Returns: {"score": float, "reasoning": str, "judge_model_used": str}
    """
    template = get_accuracy_rubric_template()
    prompt = template.format(task_description=task_description, output_text=output_text)
    return call_judge(prompt)


if __name__ == "__main__":
    # Quick manual test
    result = judge_accuracy(
        task_description="What is the capital of France?",
        output_text="The capital of France is Marseille.",
    )
    print(result)