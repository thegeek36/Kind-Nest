from flask import Blueprint, request, jsonify
from app import db
from app.models import Volunteer

bp = Blueprint('volunteer_routes', __name__)

# Create a volunteer
@bp.route('/', methods=['POST'])
def add_volunteer():
    data = request.get_json()
    volunteer = Volunteer(
        name=data.get('name'),
        age=data.get('age'),
        contact=data.get('contact'),
        email=data.get('email'),
        address=data.get('address')
    )
    db.session.add(volunteer)
    db.session.commit()
    return jsonify({"message": "Volunteer added successfully", "volunteer": volunteer.to_dict()}), 201

# Get all volunteers
@bp.route('/', methods=['GET'])
def get_volunteers():
    volunteers = Volunteer.query.all()
    return jsonify([v.to_dict() for v in volunteers])

# Get a single volunteer by ID
@bp.route('/<int:id>', methods=['GET'])
def get_volunteer(id):
    volunteer = Volunteer.query.get_or_404(id)
    return jsonify(volunteer.to_dict())

# Update a volunteer
@bp.route('/<int:id>', methods=['PUT'])
def update_volunteer(id):
    volunteer = Volunteer.query.get_or_404(id)
    data = request.get_json()
    volunteer.name = data.get('name', volunteer.name)
    volunteer.age = data.get('age', volunteer.age)
    volunteer.contact = data.get('contact', volunteer.contact)
    volunteer.email = data.get('email', volunteer.email)
    volunteer.address = data.get('address', volunteer.address)

    db.session.commit()
    return jsonify({"message": "Volunteer updated successfully", "volunteer": volunteer.to_dict()})

# Delete a volunteer
@bp.route('/<int:id>', methods=['DELETE'])
def delete_volunteer(id):
    volunteer = Volunteer.query.get_or_404(id)
    db.session.delete(volunteer)
    db.session.commit()
    return jsonify({"message": f"Volunteer with ID {id} deleted successfully"})
