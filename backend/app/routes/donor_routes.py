from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Donor, Donation, Inventory, InventoryLog
from datetime import datetime
from app.utils.auth import generate_token
bp = Blueprint('donor_routes', __name__)

# Donor Authentication Routes

# Register new donor
@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('name', 'email', 'password')):
            return jsonify({'error': 'Missing required fields: name, email, password'}), 400
        
        # Check if donor already exists
        existing_donor = Donor.query.filter_by(email=data['email']).first()
        if existing_donor:
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new donor
        donor = Donor(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        donor.set_password(data['password'])
        
        db.session.add(donor)
        db.session.commit()
        token = generate_token(donor.id)
        return jsonify({
            'message': 'Donor registered successfully', 
            'donor': donor.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/login', methods=['POST'])
def donor_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    donor = Donor.query.filter_by(email=email).first()
    if not donor or not donor.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(donor.id)  # Use your JWT utility
    return jsonify({'message': 'Login successful', 'token': token}), 200

# Donor logout
# @bp.route('/logout', methods=['POST'])
# def logout():
#     session.pop('donor_id', None)
#     session.pop('donor_name', None)
#     session.pop('user_type', None)
#     return jsonify({'message': 'Logged out successfully'}), 200

# Check authentication status
# @bp.route('/auth-status', methods=['GET'])
# def auth_status():
#     if 'donor_id' in session:
#         donor = Donor.query.get(session['donor_id'])
#         return jsonify({
#             'authenticated': True,
#             'donor': donor.to_dict() if donor else None
#         }), 200
#     else:
#         return jsonify({'authenticated': False}), 200

# Donation Routes

@bp.route('/donations', methods=['POST'])
@jwt_required()
def make_donation():
    try:
        donor_id = get_jwt_identity()
        donor = Donor.query.get(donor_id)
        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        data = request.get_json()
        
        if not data.get('donation_type'):
            return jsonify({'error': 'Donation type is required'}), 400
        
        donation_type = data['donation_type']  # 'Money' or 'Items'
        
        # Create donation record
        donation = Donation(
            donor_id=donor.id,
            donor_name=donor.name,
            donation_type=donation_type,
            notes=data.get('notes', ''),
            status='completed'
        )
        
        if donation_type == 'Money':
            if not data.get('amount'):
                return jsonify({'error': 'Amount is required for money donations'}), 400
            donation.amount = float(data['amount'])
            
        elif donation_type == 'Items':
            items_data = data.get('items', [])
            if not items_data:
                return jsonify({'error': 'Items list is required for item donations'}), 400
            
            donated_items = []
            
            for item_data in items_data:
                if not all(k in item_data for k in ('item', 'quantity', 'category')):
                    return jsonify({'error': 'Each item must have item, quantity, and category'}), 400
                
                if item_data['quantity'] > 0:
                    donated_items.append({
                        'item': item_data['item'],
                        'quantity': item_data['quantity'],
                        'category': item_data['category']
                    })
                    
                    # Update inventory
                    update_inventory_from_donation(
                        item_name=item_data['item'],
                        category=item_data['category'],
                        quantity=item_data['quantity'],
                        donor_id=donor.id
                    )
            
            if not donated_items:
                return jsonify({'error': 'At least one item with quantity > 0 is required'}), 400
                
            donation.donated_items = donated_items
        
        db.session.add(donation)
        db.session.commit()
        
        # Add inventory logs for item donations
        if donation_type == 'Items':
            for item in donated_items:
                log_donation(
                    donation_id=donation.id,
                    donor_id=donor.id,
                    item_name=item['item'],
                    category=item['category'],
                    quantity=item['quantity'],
                    donor_name=donor.name
                )
        
        return jsonify({
            'message': 'Donation successful!',
            'donation': donation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get donor's donations
@bp.route('/donations', methods=['GET'])
@jwt_required()
def get_my_donations():
    try:
        donor_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        donations = Donation.query.filter_by(donor_id=donor_id)\
                                .order_by(Donation.date.desc())\
                                .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'donations': [donation.to_dict() for donation in donations.items],
            'total': donations.total,
            'pages': donations.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get specific donation by ID
@bp.route('/donations/<int:id>', methods=['GET'])
@jwt_required()
def get_donation(id):
    try:
        donor_id = get_jwt_identity()
        donation = Donation.query.filter_by(id=id, donor_id=donor_id).first()
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404
        
        return jsonify(donation.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get critical items that need donations
@bp.route('/critical-items', methods=['GET'])
@jwt_required()
def get_critical_items():
    try:
        # Optionally, you can use donor_id = get_jwt_identity() if you want to log or filter by donor
        critical_items = Inventory.query.filter(
            Inventory.quantity <= Inventory.critical_level
        ).order_by(Inventory.category, Inventory.item_name).all()
        
        return jsonify({
            'critical_items': [item.to_dict() for item in critical_items]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get all inventory items (for donation form)
@bp.route('/inventory-items', methods=['GET'])
@jwt_required()
def get_inventory_items():
    try:
        # Optionally, you can use donor_id = get_jwt_identity() if you want to log or filter by donor
        category = request.args.get('category')
        
        query = Inventory.query
        if category:
            query = query.filter_by(category=category)
        
        items = query.order_by(Inventory.category, Inventory.item_name).all()
        categories = db.session.query(Inventory.category.distinct()).all()
        categories = [cat[0] for cat in categories]
        
        return jsonify({
            'items': [item.to_dict() for item in items],
            'categories': categories
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get donor profile
@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        donor_id = get_jwt_identity()
        donor = Donor.query.get(donor_id)
        if not donor:
            return jsonify({'error': 'Donor not found'}), 404
        
        return jsonify(donor.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update donor profile
@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        donor_id = get_jwt_identity()
        donor = Donor.query.get(donor_id)
        if not donor:
            return jsonify({'error': 'Donor not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            donor.name = data['name']
        if 'phone' in data:
            donor.phone = data['phone']
        if 'address' in data:
            donor.address = data['address']
        
        # Handle password change separately
        if 'password' in data and data['password']:
            donor.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'donor': donor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Dashboard Stats
@bp.route('/dashboard-stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        donor_id = get_jwt_identity()
        
        # Get donation statistics
        total_donations = Donation.query.filter_by(donor_id=donor_id).count()
        total_money_donated = db.session.query(db.func.sum(Donation.amount))\
            .filter_by(donor_id=donor_id, donation_type='Money').scalar() or 0
        
        recent_donations = Donation.query.filter_by(donor_id=donor_id)\
            .order_by(Donation.date.desc()).limit(5).all()
        
        # Get critical items count
        critical_items_count = Inventory.query.filter(
            Inventory.quantity <= Inventory.critical_level
        ).count()
        
        return jsonify({
            'total_donations': total_donations,
            'total_money_donated': float(total_money_donated),
            'recent_donations': [donation.to_dict() for donation in recent_donations],
            'critical_items_count': critical_items_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500