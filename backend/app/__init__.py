from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os


db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    Migrate(app, db)

    #     # Configure JWT token revocation check
    # @jwt.token_in_blocklist_loader
    # def check_if_token_revoked(jwt_header, jwt_payload):
    #     # Import here to avoid circular imports
    #     from app.utils.auth import is_token_revoked
    #     return is_token_revoked(jwt_payload["jti"])
    
    # # JWT error handlers
    # @jwt.expired_token_loader
    # def expired_token_callback(jwt_header, jwt_payload):
    #     return {"error": "Token has expired"}, 401
    
    # @jwt.invalid_token_loader
    # def invalid_token_callback(error):
    #     return {"error": "Invalid token"}, 401

    # Register Blueprints
    from app.routes.auth_routes import bp as auth_bp
    from app.routes.orphan_routes import bp as orphan_bp
    from app.routes.volunteer_routes import bp as volunteer_bp
    from app.routes.inventory_routes import bp as inventory_bp
    from app.routes.donation_routes import bp as donation_bp
    from app.routes.event_routes import bp as event_bp
    from app.routes.dashboard_routes import bp as dashboard_bp
    from app.routes.donor_routes import bp as donor_routes_bp
    print("✅ Registering dashboard blueprint")
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(orphan_bp, url_prefix='/api/orphans')
    app.register_blueprint(volunteer_bp, url_prefix='/api/volunteers')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(donation_bp, url_prefix='/api/donations')
    app.register_blueprint(event_bp, url_prefix='/api/events')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(donor_routes_bp, url_prefix='/api/donors')

    return app

