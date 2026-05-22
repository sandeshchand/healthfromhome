from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ProviderProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Roles', {'fields': ('is_patient_family', 'is_provider')}),
    )

@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'is_active', 'phone_number')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'specialization')
    list_filter = ('is_active', 'specialization')
