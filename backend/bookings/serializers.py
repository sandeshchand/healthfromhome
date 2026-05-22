from rest_framework import serializers
from .models import Booking, BookingAssignment
from patients.serializers import PatientProfileSerializer
from services.serializers import ServicePricingSerializer
from payments.serializers import PaymentSerializer


class BookingAssignmentSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.user.get_full_name', read_only=True)
    provider_username = serializers.CharField(source='provider.user.username', read_only=True)
    provider_specialization = serializers.CharField(source='provider.specialization', read_only=True)
    provider_phone_number = serializers.CharField(source='provider.phone_number', read_only=True)
    provider_bio = serializers.CharField(source='provider.bio', read_only=True)

    class Meta:
        model = BookingAssignment
        fields = (
            'id',
            'provider_name',
            'provider_username',
            'provider_specialization',
            'provider_phone_number',
            'provider_bio',
            'assigned_at',
            'notes',
        )

class BookingSerializer(serializers.ModelSerializer):
    patient_details = PatientProfileSerializer(source='patient', read_only=True)
    service_details = ServicePricingSerializer(source='service_pricing', read_only=True)
    payment_details = PaymentSerializer(source='payment', read_only=True)
    assignment_details = BookingAssignmentSerializer(source='assignment', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('family_member', 'status')

    def validate_patient(self, patient):
        request = self.context.get('request')
        if request and patient.family_member != request.user:
            raise serializers.ValidationError('Select one of your own patient profiles.')
        return patient
