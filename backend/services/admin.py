from django.contrib import admin
from .models import City, ServiceArea, Service, ServicePricing

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    search_fields = ('name',)

@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    search_fields = ('name',)

@admin.register(ServicePricing)
class ServicePricingAdmin(admin.ModelAdmin):
    list_display = ('service', 'city', 'service_area', 'base_price', 'is_active')
    list_filter = ('city', 'service_area', 'is_active', 'service')
    search_fields = ('service__name', 'city__name', 'service_area__name')
