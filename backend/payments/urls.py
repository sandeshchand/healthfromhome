from django.urls import path
from .views import MockPaymentConfirmView, PaymentStartView, PaymentVerifyView, PaymentWebhookView

urlpatterns = [
    path('start/', PaymentStartView.as_view(), name='payment-start'),
    path('confirm-mock/', MockPaymentConfirmView.as_view(), name='payment-confirm-mock'),
    path('verify/', PaymentVerifyView.as_view(), name='payment-verify'),
    path('webhooks/<str:gateway>/', PaymentWebhookView.as_view(), name='payment-webhook'),
]
