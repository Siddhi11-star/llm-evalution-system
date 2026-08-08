"""
Shared judge-model client: calls Groq first, falls back to Gemini on failure.
Both judge agents (Accuracy, Hallucination, Relevance, ...) use this so the
fallback logic and JSON-parsing only lives in one place.
"""

import os
import json
import re
from groq import Groq
import google.generativeai as genai

GROQ_MODEL = "llama-3.3-70b-versatile"
GEMINI_MODEL = "gemini-2.0-flash"

_groq_client = None
_gemini_configured = False


def _get_groq_client():
    global _groq_client
    if _groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY not set in environment")
        _groq_client = Groq(api_key=api_key)
    return _groq_client


def _get_gemini_model():
    global _gemini_configured
    if not _gemini_configured:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in environment")
        genai.configure(api_key=api_key)
        _gemini_configured = True
    return genai.GenerativeModel(GEMINI_MODEL)


def _extract_json(text: str) -> dict:
    """
    Judge models sometimes wrap JSON in markdown code fences or add stray text.
    This strips fences and pulls out the first {...} block it can find.
    Uses re.MULTILINE so ^ and $ match line boundaries, not just string edges.
    """
    text = text.strip()
    # Strip opening fence (e.g. ```json or ```) anywhere at the start of a line
    text = re.sub(r"^```(?:json)?\s*$", "", text, flags=re.MULTILINE)
    # Strip closing fence anywhere at the end of a line
    text = re.sub(r"^```\s*$", "", text, flags=re.MULTILINE)
    text = text.strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON object found in model output: {text[:200]}")

    return json.loads(match.group(0))


def call_judge(prompt: str) -> dict:
    """
    Calls Groq first; falls back to Gemini if Groq fails for any reason
    (rate limit, timeout, bad response, etc).

    Returns a dict: {"score": float, "reasoning": str, "judge_model_used": str}
    """
    try:
        client = _get_groq_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
        )
        content = response.choices[0].message.content
        parsed = _extract_json(content)
        return {
            "score": float(parsed["score"]),
            "reasoning": parsed.get("reasoning", ""),
            "judge_model_used": GROQ_MODEL,
        }
    except Exception as groq_error:
        print(f"[judge_client] Groq failed ({groq_error}), falling back to Gemini...")

    try:
        model = _get_gemini_model()
        response = model.generate_content(prompt)
        parsed = _extract_json(response.text)
        return {
            "score": float(parsed["score"]),
            "reasoning": parsed.get("reasoning", ""),
            "judge_model_used": GEMINI_MODEL,
        }
    except Exception as gemini_error:
        raise RuntimeError(
            f"Both judge models failed. Gemini error: {gemini_error}"
        ) from gemini_error