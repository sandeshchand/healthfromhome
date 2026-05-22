from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_patient_family = models.BooleanField(default=False)
    is_provider = models.BooleanField(default=False)

class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='provider_profile')
    specialization = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.specialization}"
