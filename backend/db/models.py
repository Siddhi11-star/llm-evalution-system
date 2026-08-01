from sqlalchemy import (
    Column, String, Integer, Float, Text, ForeignKey, DateTime, JSON
)
from sqlalchemy.orm import declarative_base, relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
import uuid

Base = declarative_base()


def gen_uuid():
    return str(uuid.uuid4())


class Model(Base):
    """An LLM being evaluated/recommended (e.g. Llama 3.3, Gemini 2.0 Flash)."""
    __tablename__ = "models"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    cost_per_1k_tokens = Column(Float, nullable=True)
    avg_latency_ms = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Rubric(Base):
    """A scoring rubric used by a judge agent (e.g. Accuracy, Hallucination)."""
    __tablename__ = "rubrics"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    prompt_template = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class EvaluationRun(Base):
    """One evaluation session: a task submitted for judging."""
    __tablename__ = "evaluation_runs"

    id = Column(String, primary_key=True, default=gen_uuid)
    task_description = Column(Text, nullable=False)
    model_id = Column(String, ForeignKey("models.id"), nullable=False)
    output_text = Column(Text, nullable=False)
    task_embedding = Column(Vector(1536), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    model = relationship("Model")
    scores = relationship("Score", back_populates="evaluation_run")


class Score(Base):
    """A single judge agent's score for one evaluation run, against one rubric."""
    __tablename__ = "scores"

    id = Column(String, primary_key=True, default=gen_uuid)
    evaluation_run_id = Column(String, ForeignKey("evaluation_runs.id"), nullable=False)
    rubric_id = Column(String, ForeignKey("rubrics.id"), nullable=False)
    score_value = Column(Float, nullable=False)
    reasoning = Column(Text, nullable=True)
    judge_model_used = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    evaluation_run = relationship("EvaluationRun", back_populates="scores")
    rubric = relationship("Rubric")