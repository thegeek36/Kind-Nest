from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    UserViewSet,
    OrphanListViewSet,
    OrphanDetailViewSet,
    OrphanFullDetailViewSet,
    EducationDetailViewSet,
    HealthDetailViewSet,
    InventoryCategoryViewSet,
    InventoryItemViewSet,
    DonorListViewSet,
    DonorDetailViewSet,
    DonationViewSet,
    VolunteerViewSet,
    AdoptionViewSet,
    RegisterUserView,
    CustomTokenObtainPairView,
    #DashboardView  # Assuming a separate view for dashboard
)
from rest_framework_simplejwt.views import TokenRefreshView
# Create a router for the API
router = DefaultRouter()

# Register endpoints for each viewset
router.register(r'users', UserViewSet, basename='users')
router.register(r'orphans-list', OrphanListViewSet, basename='orphan-list')
router.register(r'orphans-detail', OrphanDetailViewSet, basename='orphan-detail')
router.register(r'orphans-full-detail', OrphanFullDetailViewSet, basename='orphan-full-detail')
router.register(r'education-details', EducationDetailViewSet, basename='education-details')
router.register(r'health-details', HealthDetailViewSet, basename='health-details')
router.register(r'inventory-categories', InventoryCategoryViewSet, basename='inventory-categories')
router.register(r'inventory-items', InventoryItemViewSet, basename='inventory-items')
router.register(r'donors-list', DonorListViewSet, basename='donors-list')
router.register(r'donors-detail', DonorDetailViewSet, basename='donors-detail')
router.register(r'donations', DonationViewSet, basename='donations')
router.register(r'volunteers', VolunteerViewSet, basename='volunteers')
router.register(r'adoptions', AdoptionViewSet, basename='adoptions')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Include all registered routes
    path('users/register/', RegisterUserView.as_view(), name='register'),  # User registration
    path('users/login/', CustomTokenObtainPairView.as_view(), name='login'),  # Login endpoint
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    #path('dashboard/', DashboardView.as_view(), name='dashboard'),  # Custom view for dashboard
]
