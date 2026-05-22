from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import PatientProfile
from .serializers import PatientProfileSerializer

class PatientProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PatientProfile.objects.filter(family_member=self.request.user)

    def perform_create(self, serializer):
        serializer.save(family_member=self.request.user)
