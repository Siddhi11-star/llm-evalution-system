# LLM-as-a-Judge Evaluation System

AI-powered evaluation platform for LLM outputs — objective, multi-agent scoring plus an Advisor Agent that recommends the best-suited LLM(s) for a given task based on historical evaluation data.

## Problem

Teams building LLM products lack a fast, objective way to check output quality. Manual review is slow, model comparisons stay subjective, and once multiple models are in play there's no clear way to know which one to use for a given task. This platform judges outputs across multiple rubrics *and* recommends which model to use next time.

## Tech Stack

- **Backend:** Python, FastAPI
- **Orchestration:** LangGraph / CrewAI (parallel judge agents + meta-aggregator)
- **Database:** PostgreSQL + pgvector (eval history + embeddings for task similarity search)
- **Frontend:** React (dashboard — model comparison, trend charts, reports)
- **Judge Models:** Groq API (Llama 3.1/3.3, Gemma), Google Gemini API, Hugging Face Inference API, Ollama (local fallback)

## Architecture

```
backend/
├── agents/          # Judge agents (Accuracy, Relevance, Reasoning, Hallucination, Safety, Style)
├── orchestration/   # LangGraph pipeline + meta-aggregator
├── advisor/         # Advisor Agent (model recommendation)
├── api/             # FastAPI routes
├── db/              # Models, migrations, pgvector setup
└── tests/
frontend/            # React dashboard
```

## Setup

```bash
# Clone
git clone https://github.com/Hitarth-Saparia/llm-judge-eval-system.git
cd llm-judge-eval-system

# Copy env template and fill in API keys
cp .env.example .env

# Spin up Postgres + pgvector, backend, frontend
docker-compose up --build
```

## Team

- **Hitarth Saparia** — Judge Agents, Orchestration & Data
- **Siddhi Borawake** — API, Dashboard & Advisor Agent

## Roadmap

- [ ] Core judge agents (Accuracy, Hallucination, Relevance)
- [ ] LangGraph orchestration + meta-aggregator
- [ ] Postgres schema + eval history storage
- [ ] React dashboard (basic)
- [ ] Remaining judge agents (Reasoning, Safety, Style)
- [ ] Advisor Agent
- [ ] Stretch: custom rubrics, adversarial test generation, CI/CD gating
