from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy import extract, func
from app import db
from app.models import User, Orphan, Volunteer, Donation, Inventory, Event

bp = Blueprint('dashboard_routes', __name__)

# Add this to your dashboard_route.py
@bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Dashboard route is working"}), 200

@bp.route('/', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    # KPIs
    num_orphans = Orphan.query.count()
    num_volunteers = Volunteer.query.count()

    # Donations this month
    now = datetime.utcnow()
    donations_this_month = Donation.query.filter(
        extract('month', Donation.date) == now.month,
        extract('year', Donation.date) == now.year
    ).count()

    # Inventory: show low quantity items (<10)
    low_inventory = Inventory.query.filter(Inventory.quantity < 10).all()
    low_items = [item.to_dict() for item in low_inventory]

    # Events
    past_events = Event.query.filter(Event.date < now).count()
    upcoming_events = Event.query.filter(Event.date >= now).count()

    # Chart: Events per month
    monthly_event_data = db.session.query(
        extract('month', Event.date).label('month'),
        func.count(Event.id).label('count')
    ).group_by('month').all()
    chart_data = [{"month": m, "events": c} for m, c in monthly_event_data]

    return jsonify({
        "welcome": f"Welcome, {user.name}",
        "kpis": {
            "orphans": num_orphans,
            "volunteers": num_volunteers,
            "donations_this_month": donations_this_month,
            "low_inventory_items": low_items,
            "past_events": past_events,
            "upcoming_events": upcoming_events
        },
        "charts": {
            "events_per_month": chart_data
        }
    }),200
