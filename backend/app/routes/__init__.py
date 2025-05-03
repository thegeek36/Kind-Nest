# app/routes/__init__.py
from .auth_routes import bp as auth_routes
from .orphan_routes import bp as orphan_routes
from .volunteer_routes import bp as volunteer_routes
from .inventory_routes import bp as inventory_routes
from .donation_routes import bp as donation_routes
from .event_routes import bp as event_routes
from .dashboard_routes import bp as dashboard_routes


