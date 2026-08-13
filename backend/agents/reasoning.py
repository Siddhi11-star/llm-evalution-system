"""Reasoning quality judge agent."""

from agents.base_judge import BaseJudge


class ReasoningJudge(BaseJudge):
    rubric_key = "reasoning"
    prompt_template = (
        "Evaluate the quality of reasoning in the following AI response.\n\n"
        "Assess:\n"
        "- Logical coherence and step-by-step clarity\n"
        "- Validity of inferences\n"
        "- Handling of ambiguity or edge cases\n"
        "- Chain-of-thought quality if present\n\n"
        'Score 0\u2013100. Return ONLY valid JSON: {{ "score": <int>, "reasoning": "<string>" }}'
    )
