from datetime import date
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from patients.models import PatientProfile
from services.models import City, ServiceArea, Service, ServicePricing
from payments.models import Payment
from users.models import ProviderProfile
from .models import Booking, BookingAssignment

User = get_user_model()


class BookingApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('family', password='StrongPass123!', is_patient_family=True)
        self.other_user = User.objects.create_user('other', password='StrongPass123!', is_patient_family=True)
        self.patient = PatientProfile.objects.create(
            family_member=self.user,
            first_name='Aama',
            last_name='Shrestha',
            date_of_birth='1948-01-01',
            gender='F',
            address='Kathmandu',
            emergency_contact_name='Family Member',
            emergency_contact_phone='9800000000',
        )
        self.other_patient = PatientProfile.objects.create(
            family_member=self.other_user,
            first_name='Buba',
            last_name='Shrestha',
            date_of_birth='1945-01-01',
            gender='M',
            address='Lalitpur',
            emergency_contact_name='Other Family',
            emergency_contact_phone='9811111111',
        )
        city = City.objects.create(name='Kathmandu')
        area = ServiceArea.objects.create(name='Inside Ring Road')
        service = Service.objects.create(name='Nurse Visit', description='Home nurse visit')
        self.pricing = ServicePricing.objects.create(
            city=city,
            service_area=area,
            service=service,
            base_price=1500,
        )
        self.client.force_authenticate(self.user)

    def test_user_can_create_booking_for_own_patient(self):
        response = self.client.post('/api/bookings/', {
            'patient': self.patient.id,
            'service_pricing': self.pricing.id,
            'requested_date': date.today().isoformat(),
            'special_instructions': 'Morning preferred',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = Booking.objects.get()
        self.assertEqual(booking.family_member, self.user)
        self.assertEqual(booking.status, 'REQUESTED')

    def test_user_cannot_book_for_another_family_patient(self):
        response = self.client.post('/api/bookings/', {
            'patient': self.other_patient.id,
            'service_pricing': self.pricing.id,
            'requested_date': date.today().isoformat(),
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Booking.objects.count(), 0)

    def test_booking_detail_includes_payment_for_owner(self):
        booking = Booking.objects.create(
            family_member=self.user,
            patient=self.patient,
            service_pricing=self.pricing,
            requested_date=date.today(),
        )
        Payment.objects.create(booking=booking, amount=1500, status='PENDING')

        response = self.client.get(f'/api/bookings/{booking.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['payment_details']['status'], 'PENDING')
        self.assertEqual(response.data['payment_details']['amount'], '1500.00')

    def test_booking_detail_includes_assignment_provider_for_owner(self):
        provider_user = User.objects.create_user(
            'provider',
            password='StrongPass123!',
            first_name='Nurse',
            last_name='Maya',
            is_provider=True,
        )
        provider = ProviderProfile.objects.create(
            user=provider_user,
            specialization='Nursing',
            phone_number='9800000001',
        )
        booking = Booking.objects.create(
            family_member=self.user,
            patient=self.patient,
            service_pricing=self.pricing,
            requested_date=date.today(),
            status='ASSIGNED',
        )
        BookingAssignment.objects.create(booking=booking, provider=provider, notes='Morning visit assigned')

        response = self.client.get(f'/api/bookings/{booking.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['assignment_details']['provider_name'], 'Nurse Maya')
        self.assertEqual(response.data['assignment_details']['provider_specialization'], 'Nursing')
        self.assertEqual(response.data['assignment_details']['provider_phone_number'], '9800000001')
