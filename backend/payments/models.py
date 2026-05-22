from django.db import models
from bookings.models import Booking

class Payment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]
    METHOD_CHOICES = [
        ('CARD', 'Visa/Mastercard'),
        ('KHALTI', 'Khalti'),
        ('ESEWA', 'eSewa'),
    ]
    GATEWAY_CHOICES = [
        ('MOCK', 'Mock local gateway'),
        ('STRIPE', 'Stripe'),
        ('KHALTI', 'Khalti'),
        ('ESEWA', 'eSewa'),
    ]

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='NPR')
    payment_method = models.CharField(max_length=50, choices=METHOD_CHOICES, default='CARD')
    gateway = models.CharField(max_length=50, choices=GATEWAY_CHOICES, default='MOCK')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    transaction_id = models.CharField(max_length=255, blank=True)
    gateway_payment_id = models.CharField(max_length=255, blank=True)
    gateway_reference = models.CharField(max_length=255, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    failure_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for Booking #{self.booking.id} - {self.amount}"
