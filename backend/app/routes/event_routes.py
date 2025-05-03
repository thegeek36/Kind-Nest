from flask import Blueprint, request, jsonify
from app import db
from app.models import Event
from datetime import datetime


bp = Blueprint('event_routes', __name__)

# Add new event
@bp.route('/', methods=['POST'])
def add_event():
    data = request.get_json()
    event = Event(
        name=data.get('name'),
        description=data.get('description'),
        date=datetime.fromisoformat(data.get('date')),
        participants=data.get('participants'),
        location=data.get('location')
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Event added successfully", "event": event.to_dict()}), 201

# Get all events
@bp.route('/', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.date.desc()).all()
    return jsonify([e.to_dict() for e in events])

# Get event by ID
@bp.route('/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get_or_404(id)
    return jsonify(event.to_dict())

# Update event
@bp.route('/<int:id>', methods=['PUT'])
def update_event(id):
    event = Event.query.get_or_404(id)
    data = request.get_json()
    event.name = data.get('name', event.name)
    event.description = data.get('description', event.description)
    if data.get('date'):
        event.date = datetime.fromisoformat(data.get('date'))
    event.participants = data.get('participants', event.participants)
    event.location = data.get('location', event.location)

    db.session.commit()
    return jsonify({"message": "Event updated successfully", "event": event.to_dict()})

# Delete event
@bp.route('/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": f"Event with ID {id} deleted successfully"})
