# LLM Judge Eval System

This project is a web application designed to manage, evaluate, and configure LLM models. It consists of a static Vanilla HTML/CSS/JS frontend and a Python Flask REST API backend, backed by MongoDB and Ollama for local model execution.

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3 (Tailwind via CDN), JavaScript.
- **Backend**: Python 3.10+, Flask.
- **Database**: MongoDB.
- **AI/LLM**: Ollama (for local model inference).

## Setup Instructions

### 1. Prerequisites
- **Python 3.10+** installed on your system.
- **MongoDB** running locally (default port 27017).
- **Ollama** installed and running on your system.

### 2. Ollama Installation & Setup
1. Install Ollama from [ollama.com](https://ollama.com/).
2. Start the Ollama service on your machine.
3. Pull an open-source model you'd like to use (e.g., `llama3`):
   ```bash
   ollama run llama3
   ```

### 3. Backend Setup (Flask + MongoDB)
1. Navigate to the root of the project:
   ```bash
   cd llm-judge-eval-system
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Configure Environment Variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Make sure your `MONGO_URI` and `OLLAMA_BASE_URL` point to your running services.

### 4. Running the Application

**Start the Flask Backend**:
Make sure your virtual environment is activated, then run:
```bash
python backend/run.py
```
The backend will run at `http://localhost:5000/api`.

**Run the Frontend**:
Since the frontend is vanilla HTML/CSS/JS, you can simply open the files in your browser, or start a simple HTTP server in the `frontend` directory:
```bash
cd frontend
python -m http.server 8080
```
Then navigate to `http://localhost:8080/src/pages/landing.html`.

## API Endpoints
- `GET /api/health` - Check backend and DB connection status.
- `GET /api/models` - List local models available in Ollama.
- `POST /api/evaluate` - Generate a response using a specified model and prompt.
