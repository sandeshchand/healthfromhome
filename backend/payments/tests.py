from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from bookings.models import Booking
from patients.models import PatientProfile
from services.models import City, Service, ServiceArea, ServicePricing
from .models import Payment

User = get_user_model()


class MockPaymentApiTests(APITestCase):
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
        city = City.objects.create(name='Kathmandu')
        area = ServiceArea.objects.create(name='Inside Ring Road')
        service = Service.objects.create(name='Nurse Visit', description='Home nurse visit')
        self.pricing = ServicePricing.objects.create(
            city=city,
            service_area=area,
            service=service,
            base_price=1500,
        )
        self.booking = Booking.objects.create(
            family_member=self.user,
            patient=self.patient,
            service_pricing=self.pricing,
            requested_date=date.today(),
            status='UNDER_REVIEW',
        )
        self.client.force_authenticate(self.user)

    def test_start_payment_creates_pending_payment_for_own_booking(self):
        response = self.client.post('/api/payments/start/', {
            'booking_id': self.booking.id,
            'payment_method': 'KHALTI',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'PENDING')
        self.assertEqual(response.data['payment_method'], 'KHALTI')
        self.assertEqual(response.data['gateway'], 'MOCK')
        self.assertTrue(response.data['gateway_payment_id'].startswith('KHALTI-MOCK-SESSION-'))
        self.assertEqual(response.data['amount'], '1500.00')
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, 'PAYMENT_PENDING')

    def test_confirm_mock_payment_marks_payment_completed_and_booking_confirmed(self):
        payment = Payment.objects.create(booking=self.booking, amount=1500, payment_method='CARD', status='PENDING')

        response = self.client.post('/api/payments/confirm-mock/', {
            'payment_id': payment.id,
            'card_last4': '4242',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.booking.refresh_from_db()
        self.assertEqual(payment.status, 'COMPLETED')
        self.assertTrue(payment.transaction_id.startswith('CARD-MOCK-'))
        self.assertIsNotNone(payment.paid_at)
        self.assertEqual(self.booking.status, 'CONFIRMED')

    def test_confirm_mock_wallet_payment_for_esewa(self):
        payment = Payment.objects.create(booking=self.booking, amount=1500, payment_method='ESEWA', status='PENDING')

        response = self.client.post('/api/payments/confirm-mock/', {
            'payment_id': payment.id,
            'wallet_phone': '9800000000',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.assertEqual(payment.status, 'COMPLETED')
        self.assertTrue(payment.transaction_id.startswith('ESEWA-MOCK-'))

    def test_verify_mock_payment_can_complete_pending_payment(self):
        payment = Payment.objects.create(booking=self.booking, amount=1500, payment_method='KHALTI', status='PENDING')

        response = self.client.post('/api/payments/verify/', {
            'payment_id': payment.id,
            'wallet_phone': '9800000000',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.assertEqual(payment.status, 'COMPLETED')
        self.assertTrue(payment.transaction_id.startswith('KHALTI-MOCK-'))

    def test_unconfigured_gateway_returns_not_implemented(self):
        payment = Payment.objects.create(
            booking=self.booking,
            amount=1500,
            payment_method='CARD',
            gateway='STRIPE',
            status='PENDING',
        )

        response = self.client.post('/api/payments/verify/', {
            'payment_id': payment.id,
            'card_last4': '4242',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_501_NOT_IMPLEMENTED)

    def test_user_cannot_start_payment_for_another_family_booking(self):
        other_patient = PatientProfile.objects.create(
            family_member=self.other_user,
            first_name='Buba',
            last_name='Shrestha',
            date_of_birth='1945-01-01',
            gender='M',
            address='Lalitpur',
            emergency_contact_name='Other Family',
            emergency_contact_phone='9811111111',
        )
        other_booking = Booking.objects.create(
            family_member=self.other_user,
            patient=other_patient,
            service_pricing=self.pricing,
            requested_date=date.today(),
        )

        response = self.client.post('/api/payments/start/', {
            'booking_id': other_booking.id,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Payment.objects.count(), 0)
