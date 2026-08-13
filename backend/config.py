"""
Centralised configuration — loads .env and exports typed settings.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # ── MongoDB ───────────────────────────────────────────────────────────────
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB: str = os.getenv("MONGO_DB", "judgeai_db")

    # ── Ollama Cloud (priority 1) ─────────────────────────────────────────────
    OLLAMA_CLOUD_URL: str = os.getenv("OLLAMA_CLOUD_URL", "")
    OLLAMA_CLOUD_MODEL: str = os.getenv("OLLAMA_CLOUD_MODEL", "qwen3:14b")

    # ── Ollama Local (priority 2) ─────────────────────────────────────────────
    OLLAMA_LOCAL_URL: str = os.getenv("OLLAMA_LOCAL_URL", "http://localhost:11434")
    OLLAMA_LOCAL_MODEL: str = os.getenv("OLLAMA_LOCAL_MODEL", "qwen3:14b")

    # ── Groq (priority 3) ────────────────────────────────────────────────────
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # ── HuggingFace (priority 4) ──────────────────────────────────────────────
    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "")
    HF_MODEL_ID: str = os.getenv("HF_MODEL_ID", "meta-llama/Llama-3.3-70B-Instruct")

    # ── Flask ─────────────────────────────────────────────────────────────────
    FLASK_PORT: int = int(os.getenv("FLASK_PORT", "5000"))
    FLASK_DEBUG: bool = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    # ── Provider fallback order ───────────────────────────────────────────────
    PROVIDER_ORDER: list[str] = ["ollama_cloud", "ollama_local", "groq", "huggingface"]

    # ── Timeouts (seconds) ────────────────────────────────────────────────────
    LLM_TIMEOUT: int = int(os.getenv("LLM_TIMEOUT", "60"))


cfg = Config()
