from rest_framework import serializers
from .models import City, ServiceArea, Service, ServicePricing

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class ServiceAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceArea
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ServicePricingSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    service_area = ServiceAreaSerializer(read_only=True)

    class Meta:
        model = ServicePricing
        fields = '__all__'
