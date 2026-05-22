from django.contrib import admin
from .models import MedicalRecord, MedicalRecordAccessLog

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'booking', 'content_type', 'file_size', 'uploaded_by', 'uploaded_at')
    list_filter = ('content_type', 'storage_backend', 'uploaded_at')
    search_fields = ('title', 'patient__first_name', 'patient__last_name', 'original_filename')
    readonly_fields = ('original_filename', 'file_size', 'content_type', 'storage_backend', 'uploaded_by', 'uploaded_at')

    def save_model(self, request, obj, form, change):
        if not obj.uploaded_by:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(MedicalRecordAccessLog)
class MedicalRecordAccessLogAdmin(admin.ModelAdmin):
    list_display = ('medical_record', 'actor', 'action', 'ip_address', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('medical_record__title', 'actor__username', 'actor__email', 'ip_address')
    readonly_fields = ('medical_record', 'actor', 'action', 'ip_address', 'user_agent', 'created_at')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
