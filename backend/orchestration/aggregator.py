"""
Meta-aggregator — combines individual judge scores into an overall result.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from agents.base_judge import JudgeResult


@dataclass
class EvalResult:
    """Final aggregated evaluation result."""

    task_description: str
    output_text: str
    model_id: str
    overall_score: float
    status: str                          # "Passed" | "Flagged"
    judges_count: int
    scores: list[dict] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "task_description": self.task_description,
            "output_text": self.output_text,
            "model_id": self.model_id,
            "overall_score": round(self.overall_score, 1),
            "status": self.status,
            "judges_count": self.judges_count,
            "scores": self.scores,
        }


# ── Default rubric weights (equal) ───────────────────────────────────────────

DEFAULT_WEIGHTS: dict[str, float] = {
    "accuracy": 1.0,
    "relevance": 1.0,
    "reasoning": 1.0,
    "hallucination": 1.0,
    "safety": 1.0,
    "style": 1.0,
}


def aggregate(
    task_description: str,
    output_text: str,
    model_id: str,
    judge_results: list[JudgeResult],
    weights: dict[str, float] | None = None,
) -> EvalResult:
    """
    Compute a weighted average of rubric scores and determine pass/flag status.

    Parameters
    ----------
    judge_results : list[JudgeResult]
        Individual rubric results from the parallel judge agents.
    weights : dict | None
        Optional rubric→weight mapping. Defaults to equal weighting.

    Returns
    -------
    EvalResult
    """
    w = weights or DEFAULT_WEIGHTS

    total_weight = 0.0
    weighted_sum = 0.0
    scores: list[dict] = []

    for jr in judge_results:
        rubric_weight = w.get(jr.rubric_key, 1.0)
        weighted_sum += jr.score_value * rubric_weight
        total_weight += rubric_weight
        scores.append(jr.to_dict())

    overall = weighted_sum / total_weight if total_weight else 0.0
    status = "Passed" if overall >= 75 else "Flagged"

    return EvalResult(
        task_description=task_description,
        output_text=output_text,
        model_id=model_id,
        overall_score=overall,
        status=status,
        judges_count=len(judge_results),
        scores=scores,
    )
