from flask import Blueprint, request, jsonify
from app import db
from app.models import Inventory, InventoryLog

bp = Blueprint('inventory_routes', __name__)

@bp.route('/', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([item.to_dict() for item in items])

@bp.route('/logs', methods=['GET'])
def get_logs():
    logs = InventoryLog.query.order_by(InventoryLog.timestamp.desc()).all()
    return jsonify([log.to_dict() for log in logs])

@bp.route('/deduct', methods=['POST'])
def deduct_inventory():
    data = request.get_json()
    item_name = data.get('item')
    qty = data.get('quantity')

    inv_item = Inventory.query.filter_by(item_name=item_name).first()
    if not inv_item or inv_item.quantity < qty:
        return jsonify({"error": "Insufficient stock"}), 400

    inv_item.quantity -= qty

    # Updated to match our model
    log = InventoryLog(
        item_name=item_name,
        category=inv_item.category,  # Get category from inventory item
        action='REMOVE',
        quantity=qty,  # This is the total quantity
        quantity_changed=-qty,  # This is the change (negative)
        remarks=data.get('remarks', 'Used')
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": f"{qty} {item_name} removed from inventory."})

# ✅ Add New Inventory Item
@bp.route('/add', methods=['POST'])
def add_inventory():
    data = request.get_json()
    item_name = data.get('item_name')
    category = data.get('category')
    quantity = data.get('quantity', 0)

    if not item_name or not category:
        return jsonify({"error": "Item name and category required"}), 400

    existing = Inventory.query.filter_by(item_name=item_name, category=category).first()
    if existing:
        return jsonify({"error": "Item already exists. Use update instead."}), 400

    item = Inventory(item_name=item_name, category=category, quantity=quantity)
    db.session.add(item)

    # Log it - updated to match our model
    log = InventoryLog(
        item_name=item_name,
        category=category,
        action="Added",
        quantity=quantity,
        quantity_changed=quantity,
        remarks="Initial addition"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Item added", "item": item.to_dict()}), 201

# ✅ Update Inventory Quantity (add or subtract)
@bp.route('/update', methods=['PUT'])
def update_inventory():
    data = request.get_json()
    item_name = data.get('item_name')
    category = data.get('category')
    quantity_change = data.get('quantity_change', 0)  # can be negative

    item = Inventory.query.filter_by(item_name=item_name, category=category).first()
    if not item:
        return jsonify({"error": "Item not found"}), 404

    if item.quantity + quantity_change < 0:
        return jsonify({"error": "Insufficient quantity"}), 400

    old_quantity = item.quantity
    item.quantity += quantity_change

    # Log it - updated to match our model
    action = "Added" if quantity_change > 0 else "Deducted"
    log = InventoryLog(
        item_name=item_name,
        category=category,
        action=action,
        quantity=item.quantity,  # Current quantity after change
        quantity_changed=quantity_change,
        remarks=f"Updated from {old_quantity} to {item.quantity}"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": f"Inventory {action.lower()}", "item": item.to_dict()})

# ✅ Delete an Inventory Item
@bp.route('/delete/<int:item_id>', methods=['DELETE'])
def delete_inventory(item_id):
    item = Inventory.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    db.session.delete(item)

    # Log deletion - updated to match our model
    log = InventoryLog(
        item_name=item.item_name,
        category=item.category,
        action="Deleted",
        quantity=0,  # Final quantity is 0
        quantity_changed=-item.quantity,  # Negative of previous quantity
        remarks=f"Deleted item with quantity {item.quantity}"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Item deleted", "item_name": item.item_name})