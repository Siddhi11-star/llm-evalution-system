"""Relevance judge agent."""

from agents.base_judge import BaseJudge


class RelevanceJudge(BaseJudge):
    rubric_key = "relevance"
    prompt_template = (
        "You are a judge evaluating how relevant an AI response is to the user\u2019s question.\n\n"
        "Consider:\n"
        "- Does the response directly address what was asked?\n"
        "- Is irrelevant content included?\n"
        "- Are important aspects of the question ignored?\n\n"
        'Score 0\u2013100. Return ONLY valid JSON: {{ "score": <int>, "reasoning": "<string>" }}'
    )
