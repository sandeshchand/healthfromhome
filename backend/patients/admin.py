from django.contrib import admin
from .models import PatientProfile

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'family_member', 'gender', 'date_of_birth')
    search_fields = ('first_name', 'last_name', 'family_member__username', 'family_member__email')
    list_filter = ('gender',)
