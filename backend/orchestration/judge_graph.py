# backend/orchestration/judge_graph.py

import json
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END

from backend.agents.accuracy import judge_accuracy
from backend.agents.hallucination import judge_hallucination
from backend.agents.relevance import judge_relevance


def merge_scores(left: dict, right: dict) -> dict:
    """Reducer: merge partial individual_scores dicts from parallel judge nodes."""
    return {**left, **right}


class JudgeState(TypedDict):
    task_description: str
    output_text: str
    model_id: str
    individual_scores: Annotated[dict, merge_scores]
    overall_score: float


# Weighted average — equal weights for now, tune later
RUBRIC_WEIGHTS = {
    "Accuracy": 1.0,
    "Hallucination": 1.0,
    "Relevance": 1.0,
}


def accuracy_node(state: JudgeState) -> dict:
    result = judge_accuracy(state["task_description"], state["output_text"])
    return {"individual_scores": {"Accuracy": result}}


def hallucination_node(state: JudgeState) -> dict:
    result = judge_hallucination(state["task_description"], state["output_text"])
    return {"individual_scores": {"Hallucination": result}}


def relevance_node(state: JudgeState) -> dict:
    result = judge_relevance(state["task_description"], state["output_text"])
    return {"individual_scores": {"Relevance": result}}


def aggregator_node(state: JudgeState) -> dict:
    scores = state["individual_scores"]
    # Only include judges that both returned a result AND have a defined weight
    valid = {name: scores[name] for name in scores if name in RUBRIC_WEIGHTS}
    total_weight = sum(RUBRIC_WEIGHTS[name] for name in valid)
    weighted_sum = sum(
        # Clamp each score to [0, 10] so a misbehaving LLM can't corrupt the overall
        max(0.0, min(10.0, valid[name]["score"])) * RUBRIC_WEIGHTS[name]
        for name in valid
    )
    overall = weighted_sum / total_weight if total_weight else 0.0
    return {"overall_score": round(overall, 2)}


def build_judge_graph():
    builder = StateGraph(JudgeState)

    builder.add_node("accuracy", accuracy_node)
    builder.add_node("hallucination", hallucination_node)
    builder.add_node("relevance", relevance_node)
    builder.add_node("aggregator", aggregator_node)

    # Static fan-out — no router, no Send needed for a fixed judge set
    builder.add_edge(START, "accuracy")
    builder.add_edge(START, "hallucination")
    builder.add_edge(START, "relevance")

    # Fan-in — aggregator waits for all three
    builder.add_edge("accuracy", "aggregator")
    builder.add_edge("hallucination", "aggregator")
    builder.add_edge("relevance", "aggregator")

    builder.add_edge("aggregator", END)

    return builder.compile()


judge_graph = build_judge_graph()


def run_evaluation(task_description: str, output_text: str, model_id: str) -> dict:
    """Runs the full parallel judge pipeline and returns the stable output shape
    that Siddhi's dashboard reads directly. Do not rename these keys without
    flagging it to her."""
    result = judge_graph.invoke({
        "task_description": task_description,
        "output_text": output_text,
        "model_id": model_id,
        "individual_scores": {},
        "overall_score": 0.0,
    })
    return {
        "overall_score": result["overall_score"],
        "individual_scores": result["individual_scores"],
    }


if __name__ == "__main__":
    # Smoke test — no DB writes yet, that's step 2
    output = run_evaluation(
        task_description="Summarize the causes of World War I in 3 sentences.",
        output_text=(
            "World War I began in 1914 after the assassination of Archduke "
            "Franz Ferdinand. Alliance systems dragged multiple powers into "
            "conflict. It lasted until 1918."
        ),
        model_id="test-model-id",
    )
    print(json.dumps(output, indent=2))