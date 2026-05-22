from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'amount', 'status', 'created_at')
    list_editable = ('status',)
    list_filter = ('status', 'created_at')
    search_fields = ('booking__id', 'transaction_id')
    actions = ['mark_pending', 'mark_completed', 'mark_failed', 'mark_refunded']

    @admin.action(description='Mark selected payments as pending')
    def mark_pending(self, request, queryset):
        queryset.update(status='PENDING')

    @admin.action(description='Mark selected payments as completed')
    def mark_completed(self, request, queryset):
        queryset.update(status='COMPLETED')

    @admin.action(description='Mark selected payments as failed')
    def mark_failed(self, request, queryset):
        queryset.update(status='FAILED')

    @admin.action(description='Mark selected payments as refunded')
    def mark_refunded(self, request, queryset):
        queryset.update(status='REFUNDED')
