"""
Unit tests for judge_client.py — fallback chain and JSON parsing.
"""

import sys
import os
import json
import pytest
from unittest.mock import patch, MagicMock

# Ensure backend/ is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from judge_client import JudgeResponse, call_judge


# ── JudgeResponse parsing ────────────────────────────────────────────────────

class TestJudgeResponseParsing:
    def test_parse_clean_json(self):
        text = '{"score": 85, "reasoning": "Good accuracy."}'
        resp = JudgeResponse(text, "groq", "llama-3.3-70b")
        assert resp.score_value == 85
        assert resp.reasoning == "Good accuracy."

    def test_parse_json_in_markdown_fence(self):
        text = 'Here is my evaluation:\n```json\n{"score": 92, "reasoning": "Very relevant."}\n```'
        resp = JudgeResponse(text, "ollama_cloud", "qwen3:14b")
        assert resp.score_value == 92

    def test_parse_json_inline(self):
        text = 'The answer scores well: {"score": 77, "reasoning": "Decent."} overall.'
        resp = JudgeResponse(text, "ollama_local", "qwen3:14b")
        assert resp.score_value == 77

    def test_parse_no_json_fallback(self):
        text = "I cannot produce JSON right now but the score is about 60."
        resp = JudgeResponse(text, "huggingface", "meta-llama")
        assert resp.score_value == 0  # falls back
        assert "60" in resp.reasoning

    def test_extra_fields_preserved(self):
        text = '{"score": 100, "reasoning": "Safe.", "violations": []}'
        resp = JudgeResponse(text, "groq", "llama")
        assert resp.parsed.get("violations") == []


# ── Fallback chain ────────────────────────────────────────────────────────────

class TestCallJudgeFallback:
    @patch("judge_client._call_ollama_cloud")
    def test_first_provider_succeeds(self, mock_cloud):
        mock_cloud.return_value = '{"score": 90, "reasoning": "Great."}'
        resp = call_judge("Evaluate this.")
        assert resp.provider == "ollama_cloud"
        assert resp.score_value == 90
        mock_cloud.assert_called_once()

    @patch("judge_client._call_ollama_local")
    @patch("judge_client._call_ollama_cloud", side_effect=Exception("cloud down"))
    def test_fallback_to_second_provider(self, mock_cloud, mock_local):
        mock_local.return_value = '{"score": 80, "reasoning": "OK."}'
        resp = call_judge("Evaluate this.")
        assert resp.provider == "ollama_local"
        assert resp.score_value == 80

    @patch("judge_client._call_groq")
    @patch("judge_client._call_ollama_local", side_effect=Exception("local down"))
    @patch("judge_client._call_ollama_cloud", side_effect=Exception("cloud down"))
    def test_fallback_to_third_provider(self, mock_cloud, mock_local, mock_groq):
        mock_groq.return_value = '{"score": 75, "reasoning": "Acceptable."}'
        resp = call_judge("Evaluate this.")
        assert resp.provider == "groq"

    @patch("judge_client._call_huggingface", side_effect=Exception("hf down"))
    @patch("judge_client._call_groq", side_effect=Exception("groq down"))
    @patch("judge_client._call_ollama_local", side_effect=Exception("local down"))
    @patch("judge_client._call_ollama_cloud", side_effect=Exception("cloud down"))
    def test_all_providers_fail_raises(self, *mocks):
        with pytest.raises(RuntimeError, match="All LLM providers failed"):
            call_judge("Evaluate this.")
