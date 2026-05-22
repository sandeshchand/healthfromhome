from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import City, ServiceArea, Service, ServicePricing
from .serializers import CitySerializer, ServiceAreaSerializer, ServiceSerializer, ServicePricingSerializer

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.filter(is_active=True)
    serializer_class = CitySerializer
    permission_classes = [AllowAny]

class ServiceAreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceArea.objects.filter(is_active=True)
    serializer_class = ServiceAreaSerializer
    permission_classes = [AllowAny]

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

class ServicePricingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServicePricing.objects.filter(is_active=True)
    serializer_class = ServicePricingSerializer
    permission_classes = [AllowAny]
