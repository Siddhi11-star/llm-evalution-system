"""Style / tone judge agent."""

from agents.base_judge import BaseJudge


class StyleJudge(BaseJudge):
    rubric_key = "style"
    prompt_template = (
        "Evaluate the writing style and tone of the AI response.\n\n"
        "Consider:\n"
        "- Appropriate register (formal/informal) for the context\n"
        "- Clarity and conciseness\n"
        "- Formatting and structure\n"
        "- Brand voice alignment\n\n"
        'Score 0\u2013100. Return ONLY valid JSON: {{ "score": <int>, "reasoning": "<string>" }}'
    )
