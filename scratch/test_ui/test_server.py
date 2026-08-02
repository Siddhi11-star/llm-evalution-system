"""
scratch/test_ui/test_server.py

Local-only throwaway test harness for judge_graph.run_evaluation().
NOT part of the real backend/api/ deliverable — see README.md in this folder.

Run from the repo root (required so `backend.orchestration...` imports resolve):
    cd ~/Desktop/llm-judge-eval-system
    source venv/bin/activate
    uvicorn scratch.test_ui.test_server:app --reload --port 8000
"""

import inspect

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.orchestration.judge_graph import run_evaluation

app = FastAPI(title="Judge Pipeline - Local Test Harness (throwaway)")

# CORS open to localhost only. No auth. No persistence. Nothing here touches Postgres.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:8000",
        "http://127.0.0.1",
        "http://127.0.0.1:8000",
        # index.html is a plain static file, often just opened via file://
        "null",
    ],
    allow_credentials=False,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


class EvalRequest(BaseModel):
    task_description: str
    output_text: str
    model_id: str


@app.post("/test-eval")
async def test_eval(req: EvalRequest):
    """
    Calls run_evaluation() from backend.orchestration.judge_graph and returns
    whatever it returns, as-is. No transformation, no storage.
    """
    try:
        result = run_evaluation(
            task_description=req.task_description,
            output_text=req.output_text,
            model_id=req.model_id,
        )
        if inspect.isawaitable(result):
            result = await result
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))