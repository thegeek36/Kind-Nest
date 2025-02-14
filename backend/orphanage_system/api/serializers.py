from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Orphan, EducationDetail, HealthDetail, InventoryCategory,
    InventoryItem, Donor, Donation, Volunteer, Adoption
)

from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'dob', 'sex', 'password', 'password2', 'is_active', 'date_joined')
        read_only_fields = ('is_active', 'date_joined')

    # Check that the two passwords match
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')  # Extract password
        user = User.objects.create_user(**validated_data)  # Create the user
        user.set_password(password)  # Hash the password
        user.save()
        return user

class EducationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationDetail
        fields = '__all__'

    def validate_marks(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Marks must be provided in dictionary format")
        for subject, mark in value.items():
            try:
                float_mark = float(mark)
                if float_mark < 0 or float_mark > 100:
                    raise serializers.ValidationError(f"Mark for {subject} must be between 0 and 100")
            except ValueError:
                raise serializers.ValidationError(f"Invalid mark value for {subject}")
        return value

class HealthDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthDetail
        fields = '__all__'

    def validate(self, data):
        if data.get('next_checkup_date') and data.get('last_checkup_date'):
            if data['next_checkup_date'] <= data['last_checkup_date']:
                raise serializers.ValidationError(
                    "Next checkup date must be after last checkup date"
                )
        return data

class OrphanDetailSerializer(serializers.ModelSerializer):
    education_details = EducationDetailSerializer(many=True, read_only=True)
    health_details = HealthDetailSerializer(many=True, read_only=True)
    
    class Meta:
        model = Orphan
        fields = '__all__'

class OrphanListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orphan
        fields = ('id', 'name', 'age', 'unique_id', 'adopted')

class InventoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryCategory
        fields = '__all__'

class InventoryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)

    class Meta:
        model = InventoryItem
        fields = '__all__'

    def validate(self, data):
        if data.get('quantity', 0) < data.get('minimum_quantity', 0):
            raise serializers.ValidationError(
                "Current quantity cannot be less than minimum quantity"
            )
        return data

class DonorListSerializer(serializers.ModelSerializer):
    total_donations = serializers.SerializerMethodField()

    class Meta:
        model = Donor
        fields = ('id', 'name', 'email', 'phone_number', 'total_donations')

    def get_total_donations(self, obj):
        return obj.donation_set.count()

class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.name', read_only=True)
    item_name = serializers.CharField(source='item.item_name', read_only=True)

    class Meta:
        model = Donation
        fields = '__all__'

    def validate(self, data):
        if data.get('quantity_donated', 0) <= 0:
            raise serializers.ValidationError("Quantity donated must be greater than 0")
        return data

class DonorDetailSerializer(serializers.ModelSerializer):
    donations = DonationSerializer(source='donation_set', many=True, read_only=True)

    class Meta:
        model = Donor
        fields = '__all__'

class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'

    def validate(self, data):
        if data.get('end_date') and data['end_date'] <= data['start_date']:
            raise serializers.ValidationError(
                "End date must be after start date"
            )
        return data

class AdoptionSerializer(serializers.ModelSerializer):
    orphan_name = serializers.CharField(source='orphan.name', read_only=True)
    orphan_age = serializers.IntegerField(source='orphan.age', read_only=True)

    class Meta:
        model = Adoption
        fields = '__all__'

    def validate(self, data):
        if data.get('orphan'):
            if data['orphan'].adopted:
                raise serializers.ValidationError(
                    "This orphan has already been adopted"
                )
        return data

class DashboardSerializer(serializers.Serializer):
    total_orphans = serializers.IntegerField()
    adopted_orphans = serializers.IntegerField()
    total_volunteers = serializers.IntegerField()
    total_donors = serializers.IntegerField()
    recent_donations = DonationSerializer(many=True)
    low_inventory_items = InventoryItemSerializer(many=True)
    upcoming_checkups = HealthDetailSerializer(many=True)

# Nested Serializers for detailed views
class OrphanFullDetailSerializer(serializers.ModelSerializer):
    education_details = EducationDetailSerializer(many=True, read_only=True)
    health_details = HealthDetailSerializer(many=True, read_only=True)
    adoption = AdoptionSerializer(read_only=True)

    class Meta:
        model = Orphan
        fields = '__all__'

class InventoryCategoryDetailSerializer(serializers.ModelSerializer):
    items = InventoryItemSerializer(many=True, read_only=True)

    class Meta:
        model = InventoryCategory
        fields = '__all__'