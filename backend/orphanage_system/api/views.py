from django.shortcuts import render
from rest_framework import generics
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Create your views here.
from rest_framework import viewsets
from .models import Orphan, EducationDetail, HealthDetail, InventoryCategory, InventoryItem, Donor, Donation, Volunteer, Adoption
from .serializers import (
    UserSerializer,
    OrphanDetailSerializer,
    OrphanListSerializer,
    OrphanFullDetailSerializer,
    EducationDetailSerializer,
    HealthDetailSerializer,
    InventoryCategorySerializer,
    InventoryItemSerializer,
    DonorListSerializer,
    DonationSerializer,
    DonorDetailSerializer,
    VolunteerSerializer,
    AdoptionSerializer,
)

#User Serializers
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# --------- Orphan ViewSet ---------
class OrphanListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing orphans.
    Only returns basic information such as ID, name, age, unique ID, and adoption status.
    """
    queryset = Orphan.objects.all()
    serializer_class = OrphanListSerializer 

class OrphanDetailViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for retrieving detailed orphan information, including education and health details.
    """
    queryset = Orphan.objects.all()
    serializer_class = OrphanDetailSerializer


class OrphanFullDetailViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for retrieving full orphan details, including adoption status, education, and health details.
    """
    queryset = Orphan.objects.all()
    serializer_class = OrphanFullDetailSerializer

# --------- Education Detail ViewSet ---------
class EducationDetailViewSet(viewsets.ModelViewSet):
    queryset = EducationDetail.objects.all()
    serializer_class = EducationDetailSerializer

# --------- Health Detail ViewSet ---------
class HealthDetailViewSet(viewsets.ModelViewSet):
    queryset = HealthDetail.objects.all()
    serializer_class = HealthDetailSerializer

# --------- Inventory Category ViewSet ---------
class InventoryCategoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryCategory.objects.all()
    serializer_class = InventoryCategorySerializer

# --------- Inventory Item ViewSet ---------
class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

# ViewSet for Donor List
class DonorListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing donors and their total donations.
    """
    queryset = Donor.objects.all()
    serializer_class = DonorListSerializer

# ViewSet for Donor Detail
class DonorDetailViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for retrieving donor details, including donation history.
    """
    queryset = Donor.objects.all()
    serializer_class = DonorDetailSerializer

# ViewSet for Donations
class DonationViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing donations.
    """
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

 

# --------- Volunteer ViewSet ---------
class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer

# --------- Adoption ViewSet ---------
class AdoptionViewSet(viewsets.ModelViewSet):
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer



class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



# Custom JWT Token Serializer (includes username and email in the response)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'username': self.user.username})
        data.update({'email': self.user.email})
        return data

# Custom Token View (to override the default login endpoint)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer 

#Register User
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Publicly accessible

