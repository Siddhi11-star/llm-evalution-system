"""
Base judge class — all six rubric judges inherit from this.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from judge_client import JudgeResponse, call_judge

logger = logging.getLogger(__name__)


@dataclass
class JudgeResult:
    """Structured result from a single judge evaluation."""

    rubric_key: str
    score_value: int
    reasoning: str
    provider: str
    judge_model_used: str
    extra: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "rubric": self.rubric_key,
            "score_value": self.score_value,
            "reasoning": self.reasoning,
            "provider": self.provider,
            "judge_model_used": self.judge_model_used,
            **self.extra,
        }


class BaseJudge:
    """
    Abstract base for a rubric judge agent.

    Subclasses set ``rubric_key`` and ``prompt_template``.
    The template may use ``{task_description}``, ``{output_text}``,
    and ``{context}`` placeholders.
    """

    rubric_key: str = ""
    prompt_template: str = ""

    def evaluate(
        self,
        task_description: str,
        output_text: str,
        context: str | None = None,
    ) -> JudgeResult:
        """Build the prompt, call the LLM, and return a structured result."""
        prompt = self._build_prompt(task_description, output_text, context)
        logger.info("Judge [%s] — calling LLM…", self.rubric_key)
        response: JudgeResponse = call_judge(prompt)
        logger.info(
            "Judge [%s] — score=%d  provider=%s",
            self.rubric_key,
            response.score_value,
            response.provider,
        )
        return JudgeResult(
            rubric_key=self.rubric_key,
            score_value=response.score_value,
            reasoning=response.reasoning,
            provider=response.provider,
            judge_model_used=response.judge_model_used,
            extra={
                k: v
                for k, v in response.parsed.items()
                if k not in ("score", "reasoning")
            },
        )

    def _build_prompt(
        self,
        task_description: str,
        output_text: str,
        context: str | None,
    ) -> str:
        """Interpolate the template with the evaluation inputs."""
        header = self.prompt_template.format(
            task_description=task_description,
            output_text=output_text,
            context=context or "No additional context provided.",
        )
        return (
            f"{header}\n\n"
            f"--- TASK ---\n{task_description}\n\n"
            f"--- AI RESPONSE TO EVALUATE ---\n{output_text}"
        )
