"""
LangGraph evaluation pipeline.

Fan-out to parallel judge agents → fan-in to meta-aggregator.
Uses LangGraph's Send API for parallel execution.
"""

from __future__ import annotations

import logging
from typing import Annotated, Any, TypedDict
import operator

from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

from agents.base_judge import BaseJudge, JudgeResult
from agents.accuracy import AccuracyJudge
from agents.relevance import RelevanceJudge
from agents.reasoning import ReasoningJudge
from agents.hallucination import HallucinationJudge
from agents.safety import SafetyJudge
from agents.style import StyleJudge
from orchestration.aggregator import aggregate, EvalResult

logger = logging.getLogger(__name__)


# ── All available judge instances ─────────────────────────────────────────────

ALL_JUDGES: dict[str, BaseJudge] = {
    "accuracy": AccuracyJudge(),
    "relevance": RelevanceJudge(),
    "reasoning": ReasoningJudge(),
    "hallucination": HallucinationJudge(),
    "safety": SafetyJudge(),
    "style": StyleJudge(),
}


# ── State types ───────────────────────────────────────────────────────────────

class EvalInput(TypedDict):
    task_description: str
    output_text: str
    model_id: str
    enabled_rubrics: list[str]           # e.g. ["accuracy","relevance",…]


class JudgeTask(TypedDict):
    """Input to a single judge node."""
    rubric_key: str
    task_description: str
    output_text: str


class PipelineState(TypedDict):
    task_description: str
    output_text: str
    model_id: str
    enabled_rubrics: list[str]
    judge_results: Annotated[list[dict], operator.add]   # fan-in via addition


# ── Node functions ────────────────────────────────────────────────────────────

def fan_out(state: PipelineState) -> list[Send]:
    """Dispatch a Send per enabled rubric → parallel judge execution."""
    sends = []
    for rubric_key in state["enabled_rubrics"]:
        sends.append(
            Send(
                "run_judge",
                {
                    "rubric_key": rubric_key,
                    "task_description": state["task_description"],
                    "output_text": state["output_text"],
                    "model_id": state["model_id"],
                    "enabled_rubrics": state["enabled_rubrics"],
                    "judge_results": [],
                },
            )
        )
    return sends


def run_judge(state: PipelineState) -> dict:
    """Execute a single judge agent and return its result."""
    rubric_key = state.get("rubric_key", "")  # type: ignore[arg-type]
    judge = ALL_JUDGES.get(rubric_key)
    if not judge:
        logger.error("Unknown rubric: %s", rubric_key)
        return {"judge_results": []}

    try:
        result: JudgeResult = judge.evaluate(
            task_description=state["task_description"],
            output_text=state["output_text"],
        )
        return {"judge_results": [result.to_dict()]}
    except Exception as exc:  # noqa: BLE001
        logger.error("Judge [%s] failed: %s", rubric_key, exc)
        return {"judge_results": []}


# ── Build the graph ───────────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    """Return a compiled LangGraph evaluation pipeline."""
    graph = StateGraph(PipelineState)

    graph.add_node("run_judge", run_judge)

    graph.add_conditional_edges(START, fan_out, ["run_judge"])
    graph.add_edge("run_judge", END)

    return graph.compile()


# ── High-level API ────────────────────────────────────────────────────────────

_compiled_graph = None


def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()
    return _compiled_graph


def run_evaluation(eval_input: EvalInput) -> EvalResult:
    """
    Execute the full evaluation pipeline:
      1. Fan-out to parallel judge agents
      2. Collect results
      3. Aggregate into a final EvalResult

    Parameters
    ----------
    eval_input : EvalInput
        Contains task_description, output_text, model_id, enabled_rubrics.

    Returns
    -------
    EvalResult
        Aggregated evaluation with overall score and individual rubric scores.
    """
    graph = get_graph()

    initial_state: PipelineState = {
        "task_description": eval_input["task_description"],
        "output_text": eval_input["output_text"],
        "model_id": eval_input["model_id"],
        "enabled_rubrics": eval_input["enabled_rubrics"],
        "judge_results": [],
    }

    logger.info(
        "Starting evaluation — model=%s  rubrics=%s",
        eval_input["model_id"],
        eval_input["enabled_rubrics"],
    )

    result_state = graph.invoke(initial_state)

    # Reconstruct JudgeResult objects from dicts for the aggregator
    judge_results = []
    for d in result_state.get("judge_results", []):
        judge_results.append(
            JudgeResult(
                rubric_key=d.get("rubric", "unknown"),
                score_value=d.get("score_value", 0),
                reasoning=d.get("reasoning", ""),
                provider=d.get("provider", ""),
                judge_model_used=d.get("judge_model_used", ""),
            )
        )

    eval_result = aggregate(
        task_description=eval_input["task_description"],
        output_text=eval_input["output_text"],
        model_id=eval_input["model_id"],
        judge_results=judge_results,
    )

    logger.info(
        "Evaluation complete — overall_score=%.1f  status=%s",
        eval_result.overall_score,
        eval_result.status,
    )

    return eval_result
