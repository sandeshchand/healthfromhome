from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(family_member=self.request.user)
            .select_related('patient', 'service_pricing__service', 'service_pricing__city', 'service_pricing__service_area')
            .select_related('payment')
            .select_related('assignment__provider__user')
            .order_by('-created_at')
        )

    def perform_create(self, serializer):
        serializer.save(family_member=self.request.user, status='REQUESTED')
