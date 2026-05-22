import mimetypes
import os
from uuid import uuid4

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from patients.models import PatientProfile
from bookings.models import Booking

ALLOWED_MEDICAL_RECORD_CONTENT_TYPES = {
    'application/pdf',
    'image/jpeg',
    'image/png',
}
ALLOWED_MEDICAL_RECORD_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png'}
MAX_MEDICAL_RECORD_SIZE = 10 * 1024 * 1024


def medical_record_upload_path(instance, filename):
    _, extension = os.path.splitext(filename)
    safe_extension = extension.lower() if extension.lower() in ALLOWED_MEDICAL_RECORD_EXTENSIONS else ''
    today = timezone.now()
    return f"medical_records/{today:%Y/%m/%d}/{uuid4().hex}{safe_extension}"


class MedicalRecord(models.Model):
    ACCESS_ACTION_CHOICES = [
        ('VIEWED', 'Viewed'),
        ('DOWNLOADED', 'Downloaded'),
    ]

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='records')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='records')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=medical_record_upload_path)
    original_filename = models.CharField(max_length=255, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    content_type = models.CharField(max_length=100, blank=True)
    storage_backend = models.CharField(max_length=50, default='LOCAL')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_medical_records',
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        super().clean()
        if not self.file:
            return

        _, extension = os.path.splitext(self.file.name)
        if extension.lower() not in ALLOWED_MEDICAL_RECORD_EXTENSIONS:
            raise ValidationError({'file': 'Only PDF, JPG, JPEG, and PNG files are allowed.'})

        file_size = getattr(self.file, 'size', self.file_size)
        if file_size and file_size > MAX_MEDICAL_RECORD_SIZE:
            raise ValidationError({'file': 'Medical record file must be 10 MB or smaller.'})

        content_type = getattr(self.file, 'content_type', '') or self.content_type
        if content_type and content_type not in ALLOWED_MEDICAL_RECORD_CONTENT_TYPES:
            raise ValidationError({'file': 'Unsupported medical record file type.'})

    def save(self, *args, **kwargs):
        if self.file:
            if not self.original_filename:
                self.original_filename = os.path.basename(self.file.name)
            self.file_size = getattr(self.file, 'size', self.file_size) or 0
            guessed_content_type, _ = mimetypes.guess_type(self.file.name)
            self.content_type = getattr(self.file, 'content_type', '') or guessed_content_type or self.content_type

        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Record: {self.title} for {self.patient}"


class MedicalRecordAccessLog(models.Model):
    ACTION_CHOICES = [
        ('VIEWED', 'Viewed'),
        ('DOWNLOADED', 'Downloaded'),
    ]

    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='access_logs')
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} {self.medical_record_id} by {self.actor_id}"
