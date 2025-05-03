from flask_jwt_extended import create_access_token
from datetime import timedelta

def generate_token(identity):
    # Ensure the identity is explicitly converted to string
    # This fixes the "Subject must be a string" error
    str_identity = str(identity)
    return create_access_token(identity=str_identity, expires_delta=timedelta(days=1))