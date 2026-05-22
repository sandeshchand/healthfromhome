from django.contrib import admin
from payments.models import Payment
from records.models import MedicalRecord
from .models import Booking, BookingAssignment

class BookingAssignmentInline(admin.StackedInline):
    model = BookingAssignment
    can_delete = False
    extra = 1
    readonly_fields = ('assigned_at',)

class PaymentInline(admin.StackedInline):
    model = Payment
    can_delete = False
    extra = 1
    fields = ('amount', 'status', 'transaction_id', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

class MedicalRecordInline(admin.TabularInline):
    model = MedicalRecord
    extra = 1
    fields = ('patient', 'title', 'description', 'file', 'original_filename', 'file_size', 'content_type', 'uploaded_by', 'uploaded_at')
    readonly_fields = ('original_filename', 'file_size', 'content_type', 'uploaded_by', 'uploaded_at')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'family_member',
        'patient',
        'service_pricing',
        'status',
        'payment_status',
        'assigned_provider',
        'requested_date',
        'created_at',
    )
    list_editable = ('status',)
    list_filter = ('status', 'requested_date', 'service_pricing__service', 'service_pricing__city')
    search_fields = (
        'id',
        'family_member__username',
        'family_member__email',
        'patient__first_name',
        'patient__last_name',
        'service_pricing__service__name',
    )
    autocomplete_fields = ('family_member', 'patient', 'service_pricing')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Family request', {
            'fields': ('family_member', 'patient', 'service_pricing', 'status'),
        }),
        ('Requested schedule', {
            'fields': ('requested_date', 'requested_time', 'special_instructions'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    inlines = [BookingAssignmentInline, PaymentInline, MedicalRecordInline]
    actions = [
        'mark_under_review',
        'mark_payment_pending',
        'mark_confirmed',
        'mark_assigned',
        'mark_in_progress',
        'mark_completed',
        'mark_follow_up_required',
        'mark_cancelled',
    ]

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related(
                'family_member',
                'patient',
                'service_pricing__service',
                'service_pricing__city',
                'payment',
                'assignment__provider__user',
            )
        )

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for deleted_object in formset.deleted_objects:
            deleted_object.delete()
        for instance in instances:
            if isinstance(instance, MedicalRecord) and not instance.uploaded_by:
                instance.uploaded_by = request.user
            instance.save()
        formset.save_m2m()

    @admin.display(description='Payment')
    def payment_status(self, obj):
        return getattr(obj.payment, 'status', 'Not added')

    @admin.display(description='Provider')
    def assigned_provider(self, obj):
        assignment = getattr(obj, 'assignment', None)
        if not assignment:
            return 'Not assigned'
        return assignment.provider

    @admin.action(description='Mark selected bookings as under review')
    def mark_under_review(self, request, queryset):
        queryset.update(status='UNDER_REVIEW')

    @admin.action(description='Mark selected bookings as payment pending')
    def mark_payment_pending(self, request, queryset):
        queryset.update(status='PAYMENT_PENDING')

    @admin.action(description='Confirm selected bookings')
    def mark_confirmed(self, request, queryset):
        queryset.update(status='CONFIRMED')

    @admin.action(description='Mark selected bookings as assigned')
    def mark_assigned(self, request, queryset):
        queryset.update(status='ASSIGNED')

    @admin.action(description='Mark selected bookings as in progress')
    def mark_in_progress(self, request, queryset):
        queryset.update(status='IN_PROGRESS')

    @admin.action(description='Mark selected bookings as completed')
    def mark_completed(self, request, queryset):
        queryset.update(status='COMPLETED')

    @admin.action(description='Mark selected bookings as follow-up required')
    def mark_follow_up_required(self, request, queryset):
        queryset.update(status='FOLLOW_UP_REQUIRED')

    @admin.action(description='Cancel selected bookings')
    def mark_cancelled(self, request, queryset):
        queryset.update(status='CANCELLED')

@admin.register(BookingAssignment)
class BookingAssignmentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'provider', 'assigned_at')
    list_filter = ('provider', 'assigned_at')
    search_fields = ('booking__id', 'provider__user__username', 'provider__user__first_name', 'provider__user__last_name')
    autocomplete_fields = ('booking', 'provider')
    readonly_fields = ('assigned_at',)
