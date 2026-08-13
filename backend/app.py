"""
Application entry point.

Usage:
    python app.py
    python run.py    (alias)
"""

import logging
import sys
import os

# Ensure backend/ is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api import create_app
from config import cfg

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)

app = create_app()

if __name__ == "__main__":
    print(f"\n🚀  JudgeAI backend starting on http://localhost:{cfg.FLASK_PORT}\n")
    app.run(
        host="0.0.0.0",
        port=cfg.FLASK_PORT,
        debug=cfg.FLASK_DEBUG,
    )
