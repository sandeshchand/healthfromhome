from django.urls import path
from .views import RegisterView, CustomAuthToken, CurrentUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('me/', CurrentUserView.as_view(), name='me'),
]
