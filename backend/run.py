"""
Convenience alias — `python run.py` starts the server.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, cfg  # noqa: E402

if __name__ == "__main__":
    print(f"\n🚀  JudgeAI backend starting on http://localhost:{cfg.FLASK_PORT}\n")
    app.run(host="0.0.0.0", port=cfg.FLASK_PORT, debug=cfg.FLASK_DEBUG)
