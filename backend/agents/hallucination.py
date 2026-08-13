"""Hallucination detection judge agent."""

from agents.base_judge import BaseJudge


class HallucinationJudge(BaseJudge):
    rubric_key = "hallucination"
    prompt_template = (
        "You are a hallucination detection judge. Identify any claims in the response "
        "that are not supported by the provided context or that contradict known facts.\n\n"
        "For each unsupported or false claim, note it. Score 100 if no hallucinations, "
        "subtract points per detected hallucination weighted by severity.\n\n"
        'Return ONLY valid JSON: {{ "score": <int>, "hallucinations": ["..."], "reasoning": "<string>" }}'
    )
