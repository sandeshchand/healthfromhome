from django.db import models
from django.conf import settings
from patients.models import PatientProfile
from services.models import ServicePricing
from users.models import ProviderProfile

class Booking(models.Model):
    STATUS_CHOICES = [
        ('REQUESTED', 'Requested'),
        ('UNDER_REVIEW', 'Under Review'),
        ('PAYMENT_PENDING', 'Payment Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('ASSIGNED', 'Assigned'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('FOLLOW_UP_REQUIRED', 'Follow-up Required'),
    ]

    family_member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='bookings')
    service_pricing = models.ForeignKey(ServicePricing, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='REQUESTED')
    requested_date = models.DateField()
    requested_time = models.TimeField(blank=True, null=True)
    special_instructions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.service_pricing.service.name} for {self.patient}"

class BookingAssignment(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='assignment')
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name='assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Assignment for Booking #{self.booking.id} to {self.provider}"
