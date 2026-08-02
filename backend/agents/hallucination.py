"""
Hallucination judge agent.
Fetches the Hallucination rubric's prompt_template from the DB, fills in the
task/output, and calls the shared judge_client (Groq -> Gemini fallback).
"""

from backend.db.config import SessionLocal
from backend.db.models import Rubric
from backend.agents.judge_client import call_judge


def get_hallucination_rubric_template() -> str:
    db = SessionLocal()
    try:
        rubric = db.query(Rubric).filter_by(name="Hallucination").first()
        if not rubric:
            raise RuntimeError("Hallucination rubric not found — did you run the seed script?")
        return rubric.prompt_template
    finally:
        db.close()


def judge_hallucination(task_description: str, output_text: str) -> dict:
    template = get_hallucination_rubric_template()
    prompt = template.format(task_description=task_description, output_text=output_text)
    return call_judge(prompt)


if __name__ == "__main__":
    result = judge_hallucination(
        task_description="Summarize the plot of the movie Inception.",
        output_text=(
            "Inception is a 2010 film directed by Christopher Nolan. It follows a thief "
            "who steals secrets through dream-sharing. The movie won 12 Academy Awards, "
            "including Best Picture, and starred Leonardo DiCaprio as the lead."
        ),
    )
    print(result)