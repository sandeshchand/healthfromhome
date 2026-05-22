from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import MedicalRecord
from .models import MedicalRecordAccessLog
from .serializers import MedicalRecordSerializer

class MedicalRecordViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            MedicalRecord.objects
            .filter(patient__family_member=self.request.user)
            .select_related('patient', 'booking__service_pricing__service', 'booking__service_pricing__city', 'booking__service_pricing__service_area')
            .order_by('-uploaded_at')
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        self.log_access(instance, 'VIEWED')
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        record = self.get_object()
        self.log_access(record, 'DOWNLOADED')
        filename = record.original_filename or record.file.name.rsplit('/', 1)[-1]
        response = FileResponse(record.file.open('rb'), as_attachment=False, filename=filename)
        if record.content_type:
            response['Content-Type'] = record.content_type
        return response

    def log_access(self, record, action):
        request = self.request
        MedicalRecordAccessLog.objects.create(
            medical_record=record,
            actor=request.user if request.user.is_authenticated else None,
            action=action,
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:1000],
        )

    def get_client_ip(self, request):
        forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if forwarded_for:
            return forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')
