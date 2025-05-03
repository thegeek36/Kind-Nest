from app import db, bcrypt
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    

class Orphan(db.Model):
    __tablename__ = 'orphans'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    admission_date = db.Column(db.DateTime, default=datetime.utcnow)
    background = db.Column(db.Text)
    health_status = db.Column(db.String(100))
    education_status = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "admission_date": self.admission_date.isoformat(),
            "background": self.background,
            "health_status": self.health_status,
            "education_status": self.education_status
        }

class Volunteer(db.Model):
    __tablename__ = 'volunteers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.String(200))
    join_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "contact": self.contact,
            "email": self.email,
            "address": self.address,
            "join_date": self.join_date.isoformat()
        }
    
class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True)
    donor_name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    donation_type = db.Column(db.String(50), nullable=False)  # Money or Things
    amount = db.Column(db.Float, nullable=True)
    donated_items = db.Column(db.JSON, nullable=True)  # [{'item': 'Rice', 'quantity': 5}]
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "donor_name": self.donor_name,
            "age": self.age,
            "donation_type": self.donation_type,
            "amount": self.amount,
            "donated_items": self.donated_items,
            "date": self.date.isoformat() if self.date else None
        }



class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime, nullable=False)
    participants = db.Column(db.Integer)
    location = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.date.isoformat(),
            "participants": self.participants,
            "location": self.location,
            "created_at": self.created_at.isoformat()
        }

class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'Food', 'Medical', etc.
    quantity = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "item_name": self.item_name,
            "category": self.category,
            "quantity": self.quantity
        }

class InventoryLog(db.Model):
    __tablename__ = 'inventory_logs'

    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=True)  # Add this field
    action = db.Column(db.String(20), nullable=False)  # 'ADD', 'REMOVE', 'Added', 'Deducted', etc.
    quantity = db.Column(db.Integer, nullable=False)
    quantity_changed = db.Column(db.Integer, nullable=True)  # Add this field for consistency
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    remarks = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "item_name": self.item_name,
            "category": self.category if hasattr(self, 'category') else None,
            "action": self.action,
            "quantity": self.quantity,
            "quantity_changed": self.quantity_changed if hasattr(self, 'quantity_changed') else None,
            "timestamp": self.timestamp.isoformat(),
            "remarks": self.remarks
        }
