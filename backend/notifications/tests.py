from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from patients.models import PatientProfile
from .models import Reminder

User = get_user_model()


class ReminderApiTests(APITestCase):
    def test_reminders_are_limited_to_authenticated_family(self):
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
        Reminder.objects.create(patient=patient, title='Visible follow-up', due_date='2026-06-01')
        Reminder.objects.create(patient=other_patient, title='Private follow-up', due_date='2026-06-01')

        self.client.force_authenticate(user)
        response = self.client.get('/api/reminders/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Visible follow-up')
        self.assertEqual(response.data[0]['patient_details']['first_name'], 'Aama')
