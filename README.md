# LLM-as-a-Judge Evaluation System

Evaluates LLM outputs across six rubrics using parallel judge agents, a weighted meta-aggregator, and a model recommendation feature (Advisor) based on similarity search over past evaluations.

## Problem

Manual review of LLM outputs is slow and subjective, and once multiple models are in play there's no clear way to know which one to use for a given task. This system judges outputs across multiple rubrics and recommends which model to use next time via an Advisor Agent.

## Tech Stack

- **Backend:** Python + Flask
- **Database:** MongoDB (local, via PyMongo)
- **Orchestration:** LangGraph — parallel judge agents + meta-aggregator
- **Frontend:** React
- **Judge models (routing priority, Groq-first with fallback):**
  1. Ollama local — `qwen3:14b`
  2. Groq — Llama 3.3 70B
  3. Hugging Face Inference API
  4. Ollama cloud (optional fallback)
- Gemini has been fully removed from the provider chain

## My Scope (Judge Agents, Orchestration & Data)

1. MongoDB schema for models, evaluation runs, scores, rubrics
2. `judge_client.py` — shared client with Ollama-local-first fallback chain
3. Judge agents: Accuracy, Hallucination, Relevance (built), Reasoning, Safety, Style (in progress)
4. LangGraph orchestration — run agents in parallel + meta-aggregator (weighting/aggregation logic)
5. Persist `EvaluationRun` and `Score` data to MongoDB after orchestration runs
6. Stretch: custom rubrics, adversarial test generation, confidence-interval aggregation

## Siddhi's Scope (for reference — stay compatible, don't build)

1. Flask endpoints for eval results/dashboard data
2. React dashboard: model comparison table, trend charts
3. Advisor Agent: task description → embedding → similarity search → recommend LLM(s) by accuracy/hallucination/cost/latency
4. Wire Advisor Agent into API + dashboard UI
5. Stretch: CI/CD gating using confidence-interval scores

## Repo Structure

```
backend/
├── agents/          # Judge agents (Accuracy, Relevance, Reasoning, Hallucination, Safety, Style)
├── orchestration/   # LangGraph pipeline + meta-aggregator
├── advisor/         # Advisor Agent (model recommendation) — Siddhi's
├── api/             # Flask routes — Siddhi's
├── db/              # MongoDB models/schema, PyMongo setup — mine
└── tests/
frontend/            # React dashboard — Siddhi's
```

## Stable Field Names (Contract)

These field names are used across frontend, backend, and judge agents. **Do not rename.**

```
task_description
output_text
model_id
score_value
reasoning
judge_model_used
task_embedding
cost_per_1k_tokens
avg_latency_ms
provider          # values: "ollama_local", "ollama_cloud", "groq", "huggingface"
created_at
```

## Build Sequence

1. Project skeleton (`agents/`, `orchestration/`, `db/`, `api/`)
2. MongoDB schema design
3. Seed data
4. `judge_client.py` — Groq-first fallback chain
5. Individual judge agents
6. LangGraph orchestration (parallel agents + meta-aggregator)
7. MongoDB persistence

## Notes

- This project went through a simplification pivot: FastAPI → Flask, PostgreSQL/pgvector/SQLAlchemy → MongoDB, in favor of a cleaner, faster-to-build foundation.
- Judge routing is Groq-first with fallback (not simultaneous calls).
- UI prototyping done via Google Stitch, with field-name contracts baked into prompts.

## Repo

`github.com/Hitarth-Saparia/llm-judge-eval-system`
