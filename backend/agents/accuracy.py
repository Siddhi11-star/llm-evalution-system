"""Accuracy judge agent."""

from agents.base_judge import BaseJudge


class AccuracyJudge(BaseJudge):
    rubric_key = "accuracy"
    prompt_template = (
        "You are an expert judge evaluating the factual accuracy of an AI response.\n\n"
        "Compare the response against the provided reference context and ground truth. "
        "Score from 0\u2013100 where:\n"
        "- 100: All factual claims are correct and fully supported\n"
        "- 80\u201399: Minor inaccuracies that don\u2019t materially affect correctness\n"
        "- 60\u201379: Some incorrect claims but core facts are right\n"
        "- Below 60: Significant factual errors\n\n"
        'Return ONLY valid JSON: {{ "score": <int>, "reasoning": "<string>" }}'
    )
