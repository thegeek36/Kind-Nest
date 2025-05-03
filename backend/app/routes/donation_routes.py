from flask import Blueprint, request, jsonify
from app import db
from app.models import Donation
from app.models import Inventory, InventoryLog

bp = Blueprint('donation_routes', __name__)

# Add a donation
@bp.route('/', methods=['POST'])
def add_donation():
    data = request.get_json()
    donation_type = data.get('donation_type')

    donation = Donation(
        donor_name=data.get('donor_name'),
        age=data.get('age'),
        donation_type=donation_type,
        amount=data.get('amount') if donation_type == 'Money' else None,
        donated_items=data.get('donated_items') if donation_type == 'Things' else None
    )

    db.session.add(donation)

    # Handle inventory update if Things were donated
    if donation_type == 'Things':
        for item in data.get('donated_items', []):
            item_name = item.get('item')
            qty = item.get('quantity', 0)
            if qty <= 0:
                continue

            # Update or create inventory item
            inv_item = Inventory.query.filter_by(item_name=item_name).first()
            if inv_item:
                inv_item.quantity += qty
            else:
                # Categorize based on common sense
                category = 'Grocery' if item_name.lower() in ['rice', 'dal', 'milk', 'veggies'] else 'Things'
                inv_item = Inventory(item_name=item_name, category=category, quantity=qty)
                db.session.add(inv_item)

            # Log it
            log = InventoryLog(item_name=item_name, action='ADD', quantity=qty, remarks="Donated")
            db.session.add(log)

    db.session.commit()
    return jsonify({"message": "Donation added", "donation": donation.to_dict()}), 201


# Get all donations
@bp.route('/', methods=['GET'])
def get_donations():
    donations = Donation.query.all()
    return jsonify([d.to_dict() for d in donations])

# Get donation by ID
@bp.route('/<int:id>', methods=['GET'])
def get_donation(id):
    donation = Donation.query.get_or_404(id)
    return jsonify(donation.to_dict())

@bp.route('/<int:id>', methods=['PUT'])
def update_donation(id):
    donation = Donation.query.get_or_404(id)
    data = request.get_json()

    donation.donor_name = data.get('donor_name', donation.donor_name)
    donation.age = data.get('age', donation.age)
    donation.donation_type = data.get('donation_type', donation.donation_type)

    if donation.donation_type == 'Money':
        donation.amount = data.get('amount', donation.amount)
        donation.donated_items = None  # Clear the other field
    elif donation.donation_type == 'Things':
        donation.donated_items = data.get('donated_items', donation.donated_items)
        donation.amount = None  # Clear the other field

    db.session.commit()
    return jsonify({"message": "Donation updated successfully", "donation": donation.to_dict()})


# Delete donation
@bp.route('/<int:id>', methods=['DELETE'])
def delete_donation(id):
    donation = Donation.query.get_or_404(id)
    db.session.delete(donation)
    db.session.commit()
    return jsonify({"message": f"Donation with ID {id} deleted successfully"})
