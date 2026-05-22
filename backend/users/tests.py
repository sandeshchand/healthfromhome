from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()


class UserApiTests(APITestCase):
    def test_register_creates_family_member(self):
        response = self.client.post('/api/users/register/', {
            'username': 'family@example.com',
            'email': 'family@example.com',
            'password': 'StrongPass123!',
            'first_name': 'Family',
            'last_name': 'Member',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='family@example.com')
        self.assertTrue(user.is_patient_family)

    def test_login_returns_token(self):
        User.objects.create_user(
            username='family@example.com',
            email='family@example.com',
            password='StrongPass123!',
            is_patient_family=True,
        )

        response = self.client.post('/api/users/login/', {
            'username': 'family@example.com',
            'password': 'StrongPass123!',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
