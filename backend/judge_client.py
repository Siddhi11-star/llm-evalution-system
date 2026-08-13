"""
Shared LLM judge client with provider fallback chain.

Priority order (configurable via Config.PROVIDER_ORDER):
  1. Ollama cloud
  2. Ollama local  (qwen3:14b)
  3. Groq          (llama-3.3-70b-versatile)
  4. HuggingFace   Inference API
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

import requests

from config import cfg

logger = logging.getLogger(__name__)


# ── Result type ───────────────────────────────────────────────────────────────

class JudgeResponse:
    """Wrapper returned by call_judge."""

    def __init__(
        self,
        raw_text: str,
        provider: str,
        judge_model_used: str,
        parsed: dict[str, Any] | None = None,
    ):
        self.raw_text = raw_text
        self.provider = provider
        self.judge_model_used = judge_model_used
        self.parsed = parsed or self._parse(raw_text)

    @property
    def score_value(self) -> int:
        return int(self.parsed.get("score", 0))

    @property
    def reasoning(self) -> str:
        return self.parsed.get("reasoning", self.raw_text)

    def to_dict(self) -> dict:
        return {
            "score_value": self.score_value,
            "reasoning": self.reasoning,
            "provider": self.provider,
            "judge_model_used": self.judge_model_used,
            "raw_text": self.raw_text,
        }

    # ── JSON parsing helpers ──────────────────────────────────────────────────

    @staticmethod
    def _parse(text: str) -> dict:
        """Best-effort parse of LLM output into {score, reasoning, ...}."""
        # Try direct JSON parse
        try:
            return json.loads(text)
        except (json.JSONDecodeError, TypeError):
            pass

        # Try to extract a JSON block from markdown fences or inline
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass

        # Try to find first { ... } in text
        match = re.search(r"\{[^{}]*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass

        return {"score": 0, "reasoning": text}


# ── Provider implementations ─────────────────────────────────────────────────

def _call_ollama(base_url: str, model: str, prompt: str) -> str:
    """Call an Ollama-compatible /api/generate endpoint."""
    resp = requests.post(
        f"{base_url}/api/generate",
        json={"model": model, "prompt": prompt, "stream": False},
        timeout=cfg.LLM_TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json().get("response", "")


def _call_ollama_cloud(prompt: str) -> str:
    if not cfg.OLLAMA_CLOUD_URL:
        raise ValueError("OLLAMA_CLOUD_URL not configured")
    return _call_ollama(cfg.OLLAMA_CLOUD_URL, cfg.OLLAMA_CLOUD_MODEL, prompt)


def _call_ollama_local(prompt: str) -> str:
    return _call_ollama(cfg.OLLAMA_LOCAL_URL, cfg.OLLAMA_LOCAL_MODEL, prompt)


def _call_groq(prompt: str) -> str:
    if not cfg.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    from groq import Groq  # lazy import to avoid crash when key is missing

    client = Groq(api_key=cfg.GROQ_API_KEY)
    completion = client.chat.completions.create(
        model=cfg.GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=1024,
    )
    return completion.choices[0].message.content


def _call_huggingface(prompt: str) -> str:
    if not cfg.HF_API_TOKEN:
        raise ValueError("HF_API_TOKEN not configured")

    resp = requests.post(
        f"https://api-inference.huggingface.co/models/{cfg.HF_MODEL_ID}",
        headers={"Authorization": f"Bearer {cfg.HF_API_TOKEN}"},
        json={"inputs": prompt, "parameters": {"max_new_tokens": 1024, "temperature": 0.01}},
        timeout=cfg.LLM_TIMEOUT,
    )
    resp.raise_for_status()
    data = resp.json()
    if isinstance(data, list) and data:
        return data[0].get("generated_text", "")
    return str(data)


# ── Provider registry ────────────────────────────────────────────────────────

_PROVIDER_CONFIG: dict[str, tuple[str, str]] = {
    # provider_key → (function_name, model_label)
    "ollama_cloud": ("_call_ollama_cloud", cfg.OLLAMA_CLOUD_MODEL),
    "ollama_local": ("_call_ollama_local", cfg.OLLAMA_LOCAL_MODEL),
    "groq":         ("_call_groq", cfg.GROQ_MODEL),
    "huggingface":  ("_call_huggingface", cfg.HF_MODEL_ID),
}

# Module reference for dynamic lookups (allows mock.patch to work)
import sys as _sys
_this_module = _sys.modules[__name__]


# ── Public API ────────────────────────────────────────────────────────────────

def call_judge(prompt: str) -> JudgeResponse:
    """
    Call the judge LLM with automatic fallback.

    Tries each provider in ``cfg.PROVIDER_ORDER`` until one succeeds.
    Raises ``RuntimeError`` if all providers fail.
    """
    errors: list[str] = []

    for provider_key in cfg.PROVIDER_ORDER:
        fn_name, model_label = _PROVIDER_CONFIG[provider_key]
        call_fn = getattr(_this_module, fn_name)
        try:
            logger.info("Trying provider: %s", provider_key)
            raw = call_fn(prompt)
            logger.info("Provider %s succeeded", provider_key)
            return JudgeResponse(
                raw_text=raw,
                provider=provider_key,
                judge_model_used=model_label,
            )
        except Exception as exc:  # noqa: BLE001
            msg = f"{provider_key}: {exc}"
            logger.warning("Provider failed — %s", msg)
            errors.append(msg)

    raise RuntimeError(
        "All LLM providers failed:\n" + "\n".join(f"  • {e}" for e in errors)
    )

