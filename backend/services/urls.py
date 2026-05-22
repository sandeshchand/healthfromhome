from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CityViewSet, ServiceAreaViewSet, ServiceViewSet, ServicePricingViewSet

router = DefaultRouter()
router.register(r'cities', CityViewSet)
router.register(r'service-areas', ServiceAreaViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'pricing', ServicePricingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
