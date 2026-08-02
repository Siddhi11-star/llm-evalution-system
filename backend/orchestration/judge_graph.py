"""
judge_graph.py — LangGraph orchestration for parallel judge evaluation.

Graph topology (all three judge nodes run in parallel via Send):

    START
      │ _dispatch() [conditional-edges routing fn]
      ├──Send──►  run_accuracy_judge      ──┐
      ├──Send──►  run_hallucination_judge ──┼──► aggregate ──► END
      └──Send──►  run_relevance_judge     ──┘

State shape:
  - task_description / output_text: inputs, set once by the caller.
  - individual_scores: dict[str, dict] accumulated by each judge node.
  - final_result: assembled by `aggregate`, returned to the caller.

Weights are defined in JUDGE_WEIGHTS — change values there to tune scoring.
"""

from __future__ import annotations

import operator
from typing import Annotated, Any

from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from typing_extensions import TypedDict

from backend.agents.accuracy import judge_accuracy
from backend.agents.hallucination import judge_hallucination
from backend.agents.relevance import judge_relevance

# ─── Scoring weights ──────────────────────────────────────────────────────────
# Values are normalised at aggregation time so they don't need to sum to 1.
# To change a weight, edit only this dict.
JUDGE_WEIGHTS: dict[str, float] = {
    "Accuracy": 1.0,
    "Hallucination": 1.0,
    "Relevance": 1.0,
}


# ─── State definition ─────────────────────────────────────────────────────────

class GraphState(TypedDict):
    """Shared mutable state that flows through the graph."""
    task_description: str
    output_text: str
    # operator.or_ merges dicts: each judge writes {"JudgeName": {...}} into this field.
    individual_scores: Annotated[dict[str, dict], operator.or_]
    # Assembled by the aggregate node; this is what callers read back.
    final_result: dict[str, Any]


# ─── Per-judge input schema ────────────────────────────────────────────────────
# Each Send dispatches a slice of state to a node that accepts this schema.

class JudgeInput(TypedDict):
    task_description: str
    output_text: str


# ─── Nodes ────────────────────────────────────────────────────────────────────

def run_accuracy_judge(state: JudgeInput) -> dict:
    result = judge_accuracy(state["task_description"], state["output_text"])
    return {"individual_scores": {"Accuracy": result}}


def run_hallucination_judge(state: JudgeInput) -> dict:
    result = judge_hallucination(state["task_description"], state["output_text"])
    return {"individual_scores": {"Hallucination": result}}


def run_relevance_judge(state: JudgeInput) -> dict:
    result = judge_relevance(state["task_description"], state["output_text"])
    return {"individual_scores": {"Relevance": result}}


def aggregate(state: GraphState) -> dict:
    """
    Weighted-average aggregator.

    Uses JUDGE_WEIGHTS to compute overall_score, then assembles the
    stable output dict that Siddhi's dashboard reads.
    """
    scores = state["individual_scores"]

    total_weight = 0.0
    weighted_sum = 0.0
    for judge_name, weight in JUDGE_WEIGHTS.items():
        if judge_name in scores:
            weighted_sum += scores[judge_name]["score"] * weight
            total_weight += weight

    overall_score = round(weighted_sum / total_weight, 4) if total_weight else 0.0

    final_result = {
        "overall_score": overall_score,
        "individual_scores": scores,
    }
    return {"final_result": final_result}


# ─── Graph assembly ───────────────────────────────────────────────────────────

def _dispatch(state: GraphState) -> list[Send]:
    """
    Routing function for add_conditional_edges.
    Returns one Send per judge; LangGraph fans them out in parallel.
    In LangGraph 1.x, Send objects MUST be returned from a conditional-edges
    routing function — not from a regular node's return value.
    """
    payload: JudgeInput = {
        "task_description": state["task_description"],
        "output_text": state["output_text"],
    }
    return [
        Send("run_accuracy_judge",      payload),
        Send("run_hallucination_judge", payload),
        Send("run_relevance_judge",     payload),
    ]


def build_judge_graph() -> StateGraph:
    """
    Constructs and compiles the LangGraph evaluation graph.
    Call once at module load; the compiled graph is cached in JUDGE_GRAPH below.
    """
    builder = StateGraph(GraphState)

    # Parallel judge nodes — each accepts JudgeInput, returns individual_scores update
    builder.add_node("run_accuracy_judge",      run_accuracy_judge,      input_schema=JudgeInput)
    builder.add_node("run_hallucination_judge", run_hallucination_judge, input_schema=JudgeInput)
    builder.add_node("run_relevance_judge",     run_relevance_judge,     input_schema=JudgeInput)

    # Aggregation node
    builder.add_node("aggregate", aggregate)

    # Fan-out: START → _dispatch (routing fn) → all three judges in parallel
    builder.add_conditional_edges(START, _dispatch)

    # Each judge feeds into aggregate; aggregate waits for all three (barrier)
    builder.add_edge("run_accuracy_judge",      "aggregate")
    builder.add_edge("run_hallucination_judge", "aggregate")
    builder.add_edge("run_relevance_judge",     "aggregate")
    builder.add_edge("aggregate", END)

    return builder.compile()


# Module-level compiled graph — import this and call .invoke() directly
JUDGE_GRAPH = build_judge_graph()


# ─── Public entry point ───────────────────────────────────────────────────────

def run_evaluation(task_description: str, output_text: str) -> dict:
    """
    Run all three judge agents in parallel and return the aggregated verdict.

    Returns:
        {
            "overall_score": float,          # weighted average of all judges
            "individual_scores": {
                "Accuracy":      {"score": float, "reasoning": str, "judge_model_used": str},
                "Hallucination": {"score": float, "reasoning": str, "judge_model_used": str},
                "Relevance":     {"score": float, "reasoning": str, "judge_model_used": str},
            }
        }
    """
    initial_state: GraphState = {
        "task_description": task_description,
        "output_text": output_text,
        "individual_scores": {},
        "final_result": {},
    }
    final_state = JUDGE_GRAPH.invoke(initial_state)
    return final_state["final_result"]


# ─── Manual smoke test ────────────────────────────────────────────────────────

if __name__ == "__main__":
    import json

    TASK = "What is the capital of France?"
    OUTPUT = "The capital of France is Paris. It has been the country's capital since the 10th century."

    print(f"\nTask:   {TASK}")
    print(f"Output: {OUTPUT}\n")
    print("Running parallel judge evaluation...\n")

    result = run_evaluation(task_description=TASK, output_text=OUTPUT)
    print(json.dumps(result, indent=2))
