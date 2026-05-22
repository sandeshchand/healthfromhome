from django.db import models
from patients.models import PatientProfile
from bookings.models import Booking

class Reminder(models.Model):
    CHANNEL_CHOICES = [
        ('PHONE', 'Phone'),
        ('EMAIL', 'Email'),
        ('MANUAL', 'Manual'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='reminders')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='reminders')
    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    due_date = models.DateField()
    due_time = models.TimeField(blank=True, null=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='MANUAL')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} for {self.patient}"
