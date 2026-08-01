"""initial schema: models, rubrics, evaluation_runs, scores

Revision ID: 0001
Revises:
Create Date: 2026-08-01

"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "models",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("provider", sa.String(), nullable=False),
        sa.Column("cost_per_1k_tokens", sa.Float(), nullable=True),
        sa.Column("avg_latency_ms", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "rubrics",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("prompt_template", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "evaluation_runs",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("task_description", sa.Text(), nullable=False),
        sa.Column("model_id", sa.String(), sa.ForeignKey("models.id"), nullable=False),
        sa.Column("output_text", sa.Text(), nullable=False),
        sa.Column("task_embedding", Vector(1536), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )
    op.execute(
        "CREATE INDEX evaluation_runs_embedding_idx "
        "ON evaluation_runs USING ivfflat (task_embedding vector_cosine_ops) "
        "WITH (lists = 100)"
    )

    op.create_table(
        "scores",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column(
            "evaluation_run_id", sa.String(),
            sa.ForeignKey("evaluation_runs.id"), nullable=False,
        ),
        sa.Column("rubric_id", sa.String(), sa.ForeignKey("rubrics.id"), nullable=False),
        sa.Column("score_value", sa.Float(), nullable=False),
        sa.Column("reasoning", sa.Text(), nullable=True),
        sa.Column("judge_model_used", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("scores")
    op.execute("DROP INDEX IF EXISTS evaluation_runs_embedding_idx")
    op.drop_table("evaluation_runs")
    op.drop_table("rubrics")
    op.drop_table("models")
    op.execute("DROP EXTENSION IF EXISTS vector")