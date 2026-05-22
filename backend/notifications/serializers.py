from rest_framework import serializers
from patients.serializers import PatientProfileSerializer
from services.serializers import ServicePricingSerializer
from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    patient_details = PatientProfileSerializer(source='patient', read_only=True)
    booking_service_details = ServicePricingSerializer(source='booking.service_pricing', read_only=True)

    class Meta:
        model = Reminder
        fields = '__all__'
