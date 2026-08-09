from flask import Blueprint, jsonify, request
from app.services.ollama_service import get_available_models, generate_completion
from app.utils.db import get_db

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    db = get_db()
    # Simple db ping to ensure connection
    try:
        db.command('ping')
        db_status = 'connected'
    except Exception:
        db_status = 'disconnected'
        
    return jsonify({
        'status': 'ok',
        'message': 'Flask backend is running',
        'database': db_status
    })

@api_bp.route('/models', methods=['GET'])
def list_models():
    models = get_available_models()
    return jsonify({'models': models})

@api_bp.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    model = data.get('model', 'llama3')
    prompt = data.get('prompt', '')
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
        
    result = generate_completion(model, prompt)
    
    # Example of saving to DB
    if 'error' not in result:
        db = get_db()
        db.evaluations.insert_one({
            'model': model,
            'prompt': prompt,
            'response': result.get('response', ''),
            'created_at': result.get('created_at')
        })
        
    return jsonify(result)
