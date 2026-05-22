from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Reminder.objects
            .filter(patient__family_member=self.request.user)
            .select_related('patient', 'booking__service_pricing__service')
            .order_by('due_date', 'due_time', '-created_at')
        )
