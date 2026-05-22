from rest_framework import serializers
from patients.serializers import PatientProfileSerializer
from services.serializers import ServicePricingSerializer
from .models import MedicalRecord

class MedicalRecordSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    patient_details = PatientProfileSerializer(source='patient', read_only=True)
    booking_service_details = ServicePricingSerializer(source='booking.service_pricing', read_only=True)
    booking_status = serializers.CharField(source='booking.status', read_only=True)
    booking_requested_date = serializers.DateField(source='booking.requested_date', read_only=True)

    class Meta:
        model = MedicalRecord
        fields = '__all__'

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(f'/api/records/{obj.id}/download/')
        if obj.file:
            return f'/api/records/{obj.id}/download/'
        return None
