import ollama
from app.config import Config

# Ollama client configuration based on config
client = ollama.Client(host=Config.OLLAMA_BASE_URL)

def get_available_models():
    try:
        response = client.list()
        return response.get('models', [])
    except Exception as e:
        print(f"Error fetching models: {e}")
        return []

def generate_completion(model, prompt):
    try:
        response = client.generate(model=model, prompt=prompt)
        return response
    except Exception as e:
        print(f"Error generating completion: {e}")
        return {"error": str(e)}
