# app/routes/orphan_routes.py
from flask import Blueprint, request, jsonify
from app.models import Orphan

from app import db

bp = Blueprint('orphans', __name__)

@bp.route('/', methods=['GET'])
def get_all_orphans():
    orphans = Orphan.query.all()
    return jsonify([orphan.to_dict() for orphan in orphans]), 200

@bp.route('/<int:id>', methods=['GET'])
def get_orphan(id):
    orphan = Orphan.query.get_or_404(id)
    return jsonify(orphan.to_dict()), 200

@bp.route('/', methods=['POST'])
def add_orphan():
    data = request.get_json()
    new_orphan = Orphan(
        name=data['name'],
        age=data['age'],
        gender=data['gender'],
        background=data.get('background'),
        health_status=data.get('health_status'),
        education_status=data.get('education_status')
    )
    db.session.add(new_orphan)
    db.session.commit()
    return jsonify(new_orphan.to_dict()), 201

@bp.route('/<int:id>', methods=['PUT'])
def update_orphan(id):
    orphan = Orphan.query.get_or_404(id)
    data = request.get_json()

    orphan.name = data.get('name', orphan.name)
    orphan.age = data.get('age', orphan.age)
    orphan.gender = data.get('gender', orphan.gender)
    orphan.background = data.get('background', orphan.background)
    orphan.health_status = data.get('health_status', orphan.health_status)
    orphan.education_status = data.get('education_status', orphan.education_status)

    db.session.commit()
    return jsonify(orphan.to_dict()), 200

@bp.route('/<int:id>', methods=['DELETE'])
def delete_orphan(id):
    orphan = Orphan.query.get_or_404(id)
    db.session.delete(orphan)
    db.session.commit()
    return jsonify({"message": "Orphan deleted successfully."}), 200
