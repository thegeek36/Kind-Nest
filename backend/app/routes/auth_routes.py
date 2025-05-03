from flask import Blueprint, request, jsonify
from app.models import User
from app import db
from app.utils.auth import generate_token
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User

bp = Blueprint('auth_routes', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # Ensure user.id is a valid value before generating token
    if not user.id:
        return jsonify({'error': 'User registration failed'}), 500
        
    token = generate_token(user.id)
    return jsonify({'message': 'User registered successfully', 'token': token}), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user.id)
    return jsonify({'message': 'Login successful', 'token': token}), 200


@bp.route('/me', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    # Convert user_id back to the appropriate type if needed
    # If your User model expects an integer ID but jwt_identity returns a string
    try:
        if isinstance(user_id, str) and user_id.isdigit():
            user_id = int(user_id)
    except:
        pass
        
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'created_at': user.created_at
    })

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Simple logout endpoint that doesn't actually invalidate the token.
    
    This is a simpler approach that relies on the client removing the token.
    The token will still be valid until it expires, but the client will
    no longer have access to it.
    """
    return jsonify({"message": "Successfully logged out"}), 200