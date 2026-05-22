from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer

class MedicalRecordViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            MedicalRecord.objects
            .filter(patient__family_member=self.request.user)
            .select_related('patient', 'booking')
            .order_by('-uploaded_at')
        )
