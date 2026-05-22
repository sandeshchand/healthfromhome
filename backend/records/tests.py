from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from patients.models import PatientProfile
from .models import MedicalRecord

User = get_user_model()


class MedicalRecordApiTests(APITestCase):
    def test_records_are_limited_to_authenticated_family(self):
        user = User.objects.create_user('family', password='StrongPass123!', is_patient_family=True)
        other_user = User.objects.create_user('other', password='StrongPass123!', is_patient_family=True)
        patient = PatientProfile.objects.create(
            family_member=user,
            first_name='Aama',
            last_name='Shrestha',
            date_of_birth='1948-01-01',
            gender='F',
            address='Kathmandu',
            emergency_contact_name='Family Member',
            emergency_contact_phone='9800000000',
        )
        other_patient = PatientProfile.objects.create(
            family_member=other_user,
            first_name='Buba',
            last_name='Shrestha',
            date_of_birth='1945-01-01',
            gender='M',
            address='Lalitpur',
            emergency_contact_name='Other Family',
            emergency_contact_phone='9811111111',
        )
        MedicalRecord.objects.create(
            patient=patient,
            title='Visible Report',
            file=SimpleUploadedFile('visible.txt', b'visible'),
        )
        MedicalRecord.objects.create(
            patient=other_patient,
            title='Private Report',
            file=SimpleUploadedFile('private.txt', b'private'),
        )

        self.client.force_authenticate(user)
        response = self.client.get('/api/records/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Visible Report')
