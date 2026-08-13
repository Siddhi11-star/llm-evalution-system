"""
Unit tests for judge agents — mocked LLM responses.
"""

import sys
import os
import pytest
from unittest.mock import patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from judge_client import JudgeResponse
from agents.accuracy import AccuracyJudge
from agents.relevance import RelevanceJudge
from agents.reasoning import ReasoningJudge
from agents.hallucination import HallucinationJudge
from agents.safety import SafetyJudge
from agents.style import StyleJudge


def _mock_response(score: int, reasoning: str, **extra) -> JudgeResponse:
    import json
    payload = {"score": score, "reasoning": reasoning, **extra}
    return JudgeResponse(json.dumps(payload), "mock", "mock-model")


class TestAccuracyJudge:
    @patch("agents.base_judge.call_judge")
    def test_evaluate(self, mock_call):
        mock_call.return_value = _mock_response(92, "Mostly accurate.")
        judge = AccuracyJudge()
        result = judge.evaluate("Summarize this contract.", "The contract says...")
        assert result.rubric_key == "accuracy"
        assert result.score_value == 92
        assert "accurate" in result.reasoning.lower()


class TestRelevanceJudge:
    @patch("agents.base_judge.call_judge")
    def test_evaluate(self, mock_call):
        mock_call.return_value = _mock_response(88, "Directly addresses the question.")
        result = RelevanceJudge().evaluate("What is X?", "X is ...")
        assert result.rubric_key == "relevance"
        assert result.score_value == 88


class TestReasoningJudge:
    @patch("agents.base_judge.call_judge")
    def test_evaluate(self, mock_call):
        mock_call.return_value = _mock_response(85, "Logical and coherent.")
        result = ReasoningJudge().evaluate("Explain Y.", "Y works because...")
        assert result.rubric_key == "reasoning"
        assert result.score_value == 85


class TestHallucinationJudge:
    @patch("agents.base_judge.call_judge")
    def test_evaluate_no_hallucinations(self, mock_call):
        mock_call.return_value = _mock_response(100, "No hallucinations.", hallucinations=[])
        result = HallucinationJudge().evaluate("Describe Z.", "Z is ...")
        assert result.rubric_key == "hallucination"
        assert result.score_value == 100

    @patch("agents.base_judge.call_judge")
    def test_evaluate_with_hallucinations(self, mock_call):
        mock_call.return_value = _mock_response(
            65, "Several unsupported claims.",
            hallucinations=["Claim A is false", "Claim B unsupported"]
        )
        result = HallucinationJudge().evaluate("Describe Z.", "Z is ...")
        assert result.score_value == 65
        assert "hallucinations" in result.extra


class TestSafetyJudge:
    @patch("agents.base_judge.call_judge")
    def test_evaluate_safe(self, mock_call):
        mock_call.return_value = _mock_response(100, "Completely safe.", violations=[])
        result = SafetyJudge().evaluate("Advise on topic.", "Here is safe advice.")
        assert result.rubric_key == "safety"
        assert result.score_value == 100


class TestStyleJudge:
    @patch("agents.base_judge.call_judge")
    def test_evaluate(self, mock_call):
        mock_call.return_value = _mock_response(78, "Acceptable style, slightly verbose.")
        result = StyleJudge().evaluate("Write about topic.", "Topic is interesting...")
        assert result.rubric_key == "style"
        assert result.score_value == 78
