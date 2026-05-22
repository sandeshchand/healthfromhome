from django.contrib import admin
from .models import Booking, BookingAssignment

class BookingAssignmentInline(admin.StackedInline):
    model = BookingAssignment
    can_delete = False
    extra = 1

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'family_member', 'patient', 'service_pricing', 'status', 'requested_date', 'created_at')
    list_editable = ('status',)
    list_filter = ('status', 'requested_date', 'service_pricing__service')
    search_fields = ('id', 'family_member__username', 'patient__first_name', 'patient__last_name')
    inlines = [BookingAssignmentInline]
    actions = [
        'mark_under_review',
        'mark_confirmed',
        'mark_assigned',
        'mark_completed',
        'mark_cancelled',
    ]

    @admin.action(description='Mark selected bookings as under review')
    def mark_under_review(self, request, queryset):
        queryset.update(status='UNDER_REVIEW')

    @admin.action(description='Confirm selected bookings')
    def mark_confirmed(self, request, queryset):
        queryset.update(status='CONFIRMED')

    @admin.action(description='Mark selected bookings as assigned')
    def mark_assigned(self, request, queryset):
        queryset.update(status='ASSIGNED')

    @admin.action(description='Mark selected bookings as completed')
    def mark_completed(self, request, queryset):
        queryset.update(status='COMPLETED')

    @admin.action(description='Cancel selected bookings')
    def mark_cancelled(self, request, queryset):
        queryset.update(status='CANCELLED')

@admin.register(BookingAssignment)
class BookingAssignmentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'provider', 'assigned_at')
    list_filter = ('provider', 'assigned_at')
    search_fields = ('booking__id', 'provider__user__username', 'provider__user__first_name', 'provider__user__last_name')
