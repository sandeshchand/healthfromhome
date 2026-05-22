from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from patients.models import PatientProfile
from .models import MedicalRecord, MedicalRecordAccessLog

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
            file=SimpleUploadedFile('visible.pdf', b'%PDF-1.4 visible', content_type='application/pdf'),
        )
        MedicalRecord.objects.create(
            patient=other_patient,
            title='Private Report',
            file=SimpleUploadedFile('private.pdf', b'%PDF-1.4 private', content_type='application/pdf'),
        )

        self.client.force_authenticate(user)
        response = self.client.get('/api/records/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Visible Report')
        self.assertEqual(response.data[0]['patient_details']['first_name'], 'Aama')
        self.assertIn('/api/records/', response.data[0]['file_url'])

    def test_medical_record_rejects_unsupported_file_type(self):
        user = User.objects.create_user('family', password='StrongPass123!', is_patient_family=True)
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
        record = MedicalRecord(
            patient=patient,
            title='Bad Report',
            file=SimpleUploadedFile('bad.txt', b'bad', content_type='text/plain'),
        )

        with self.assertRaises(ValidationError):
            record.save()

    def test_download_record_requires_owner_and_creates_audit_log(self):
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
        record = MedicalRecord.objects.create(
            patient=patient,
            title='Visible Report',
            file=SimpleUploadedFile('visible.pdf', b'%PDF-1.4 visible', content_type='application/pdf'),
        )

        self.client.force_authenticate(other_user)
        forbidden_response = self.client.get(f'/api/records/{record.id}/download/')
        self.assertEqual(forbidden_response.status_code, status.HTTP_404_NOT_FOUND)

        self.client.force_authenticate(user)
        response = self.client.get(f'/api/records/{record.id}/download/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(MedicalRecordAccessLog.objects.count(), 1)
        log = MedicalRecordAccessLog.objects.get()
        self.assertEqual(log.actor, user)
        self.assertEqual(log.medical_record, record)
        self.assertEqual(log.action, 'DOWNLOADED')
