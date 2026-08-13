"""
Integration test for the orchestration pipeline — mocked judge agents.
"""

import sys
import os
import json
import pytest
from unittest.mock import patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from judge_client import JudgeResponse
from orchestration.graph import run_evaluation
from orchestration.aggregator import aggregate, EvalResult
from agents.base_judge import JudgeResult


# ── Aggregator unit tests ────────────────────────────────────────────────────

class TestAggregator:
    def test_equal_weights(self):
        results = [
            JudgeResult("accuracy", 90, "Good", "mock", "mock-model"),
            JudgeResult("relevance", 80, "OK", "mock", "mock-model"),
            JudgeResult("reasoning", 70, "Decent", "mock", "mock-model"),
        ]
        er = aggregate("task", "output", "model-1", results)
        assert er.overall_score == 80.0  # (90+80+70) / 3
        assert er.status == "Passed"
        assert er.judges_count == 3

    def test_custom_weights(self):
        results = [
            JudgeResult("accuracy", 100, "", "m", "m"),
            JudgeResult("safety", 50, "", "m", "m"),
        ]
        weights = {"accuracy": 3.0, "safety": 1.0}
        er = aggregate("t", "o", "m", results, weights=weights)
        expected = (100 * 3 + 50 * 1) / 4  # 87.5
        assert er.overall_score == 87.5

    def test_flagged_status(self):
        results = [
            JudgeResult("accuracy", 60, "", "m", "m"),
            JudgeResult("safety", 70, "", "m", "m"),
        ]
        er = aggregate("t", "o", "m", results)
        assert er.overall_score == 65.0
        assert er.status == "Flagged"

    def test_empty_results(self):
        er = aggregate("t", "o", "m", [])
        assert er.overall_score == 0.0
        assert er.judges_count == 0


# ── Pipeline integration test (mocked LLM calls) ─────────────────────────────

class TestRunEvaluation:
    @patch("agents.base_judge.call_judge")
    def test_full_pipeline(self, mock_call):
        """Run the full pipeline with all 6 judges, mocked at the LLM level."""
        mock_call.return_value = JudgeResponse(
            raw_text='{"score": 85, "reasoning": "Mock evaluation."}',
            provider="mock",
            judge_model_used="mock-model",
        )

        result = run_evaluation({
            "task_description": "Summarize this contract.",
            "output_text": "The contract states that...",
            "model_id": "gpt-4o",
            "enabled_rubrics": ["accuracy", "relevance", "reasoning",
                                "hallucination", "safety", "style"],
        })

        assert isinstance(result, EvalResult)
        assert result.overall_score == 85.0
        assert result.status == "Passed"
        assert result.judges_count == 6
        assert len(result.scores) == 6

    @patch("agents.base_judge.call_judge")
    def test_subset_of_rubrics(self, mock_call):
        """Run only 2 rubrics."""
        mock_call.return_value = JudgeResponse(
            raw_text='{"score": 70, "reasoning": "Below threshold."}',
            provider="mock",
            judge_model_used="mock-model",
        )

        result = run_evaluation({
            "task_description": "Test task",
            "output_text": "Test output",
            "model_id": "llama-3.1-70b",
            "enabled_rubrics": ["accuracy", "safety"],
        })

        assert result.judges_count == 2
        assert result.overall_score == 70.0
        assert result.status == "Flagged"
