from django.contrib import admin
from .models import Reminder

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'booking', 'due_date', 'due_time', 'channel', 'status')
    list_editable = ('status',)
    list_filter = ('status', 'channel', 'due_date')
    search_fields = ('title', 'notes', 'patient__first_name', 'patient__last_name', 'booking__id')
    autocomplete_fields = ('patient', 'booking')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_completed', 'mark_cancelled', 'mark_pending']

    @admin.action(description='Mark selected reminders as completed')
    def mark_completed(self, request, queryset):
        queryset.update(status='COMPLETED')

    @admin.action(description='Mark selected reminders as cancelled')
    def mark_cancelled(self, request, queryset):
        queryset.update(status='CANCELLED')

    @admin.action(description='Mark selected reminders as pending')
    def mark_pending(self, request, queryset):
        queryset.update(status='PENDING')
