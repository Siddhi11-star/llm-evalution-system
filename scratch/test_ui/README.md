# Judge Pipeline — Local Test Harness (scratch, not the real deliverable)

Local-only scratch tool to manually trigger `run_evaluation()` from `backend/orchestration/judge_graph.py` and eyeball `overall_score` / `individual_scores` without curl/Postman/print statements. This is **not** the real project dashboard — that's Siddhi's work in `frontend/`.

## What's here

- `test_server.py` — a minimal FastAPI wrapper with one endpoint, `POST /test-eval`, that calls `run_evaluation()` and returns its result as-is. No auth, no persistence, no writes to Postgres.
- `index.html` — a single static HTML/CSS/JS file (no build step, no npm) with a glassmorphism-styled form to send a task_description + output_text to the server above and render the scored result.

## Run it

```bash
# from the repo root
cd ~/Desktop/llm-judge-eval-system
source venv/bin/activate
uvicorn scratch.test_ui.test_server:app --reload --port 8000
```

Then open `scratch/test_ui/index.html` directly in a browser (just double-click it, or `open scratch/test_ui/index.html` on Mac) — no server needed for the frontend itself, it just calls `http://localhost:8000/test-eval` via fetch.

## Notes

- No new dependencies beyond what's already in `backend/requirements.txt` plus `uvicorn` (already installed).
- Doesn't touch `backend/db`, `backend/agents`, or `backend/orchestration` — only imports from `judge_graph.py`, never edits it.
- `model_id` sent from the form is currently a free-text string with no FK validation against the real `models` table — fine for this scratch tool since it never persists to Postgres, but not representative of what `run_evaluation()` will eventually require once step 2 (persistence) is wired up.
- Safe to delete this entire folder once Siddhi's real FastAPI/React dashboard is live.