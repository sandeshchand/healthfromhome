from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from .gateways import get_gateway
from .models import Payment
from .serializers import PaymentSerializer


def gateway_for_payment_method(payment_method):
    # Card, Khalti, and eSewa use MOCK locally. Real providers can be enabled here later.
    return 'MOCK'


def mark_payment_started(payment, result):
    payment.gateway_payment_id = result.gateway_payment_id or payment.gateway_payment_id
    payment.gateway_reference = result.gateway_reference or payment.gateway_reference
    payment.gateway_response = result.gateway_response or {}
    payment.failure_reason = ''
    payment.save(update_fields=[
        'gateway_payment_id',
        'gateway_reference',
        'gateway_response',
        'failure_reason',
        'updated_at',
    ])


def mark_payment_completed(payment, result):
    payment.status = 'COMPLETED'
    payment.transaction_id = result.transaction_id or payment.transaction_id
    payment.gateway_payment_id = result.gateway_payment_id or payment.gateway_payment_id
    payment.gateway_reference = result.gateway_reference or payment.gateway_reference
    payment.gateway_response = result.gateway_response or {}
    payment.failure_reason = ''
    payment.paid_at = timezone.now()
    payment.save(update_fields=[
        'status',
        'transaction_id',
        'gateway_payment_id',
        'gateway_reference',
        'gateway_response',
        'failure_reason',
        'paid_at',
        'updated_at',
    ])

    booking = payment.booking
    if booking.status in ['REQUESTED', 'UNDER_REVIEW', 'PAYMENT_PENDING']:
        booking.status = 'CONFIRMED'
        booking.save(update_fields=['status', 'updated_at'])


class PaymentStartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        payment_method = str(request.data.get('payment_method', 'CARD')).upper()

        if not booking_id:
            return Response({'booking_id': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        allowed_methods = [choice[0] for choice in Payment.METHOD_CHOICES]
        if payment_method not in allowed_methods:
            return Response({'payment_method': ['Select CARD, KHALTI, or ESEWA.']}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = (
                Booking.objects
                .select_related('service_pricing')
                .get(id=booking_id, family_member=request.user)
            )
        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                'amount': booking.service_pricing.base_price,
                'currency': 'NPR',
                'payment_method': payment_method,
                'gateway': gateway_for_payment_method(payment_method),
                'status': 'PENDING',
            },
        )

        if payment.status == 'PENDING' and payment.payment_method != payment_method:
            payment.payment_method = payment_method
            payment.gateway = gateway_for_payment_method(payment_method)
            payment.save(update_fields=['payment_method', 'gateway', 'updated_at'])

        if payment.status == 'FAILED':
            payment.status = 'PENDING'
            payment.payment_method = payment_method
            payment.gateway = gateway_for_payment_method(payment_method)
            payment.transaction_id = ''
            payment.failure_reason = ''
            payment.save(update_fields=['status', 'payment_method', 'gateway', 'transaction_id', 'failure_reason', 'updated_at'])

        gateway = get_gateway(payment.gateway)
        try:
            result = gateway.start_payment(payment)
        except NotImplementedError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_501_NOT_IMPLEMENTED)

        mark_payment_started(payment, result)

        if created and booking.status in ['REQUESTED', 'UNDER_REVIEW']:
            booking.status = 'PAYMENT_PENDING'
            booking.save(update_fields=['status', 'updated_at'])

        return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)


class MockPaymentConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get('payment_id')
        card_last4 = str(request.data.get('card_last4', '')).strip()
        wallet_phone = str(request.data.get('wallet_phone', '')).strip()

        if not payment_id:
            return Response({'payment_id': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = (
                Payment.objects
                .select_related('booking')
                .get(id=payment_id, booking__family_member=request.user)
            )
        except Payment.DoesNotExist:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if payment.status == 'COMPLETED':
            return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)

        gateway = get_gateway(payment.gateway)
        try:
            result = gateway.confirm_payment(payment, {
                'card_last4': card_last4,
                'wallet_phone': wallet_phone,
            })
        except ValueError as exc:
            field = 'card_last4' if payment.payment_method == 'CARD' else 'wallet_phone'
            return Response({field: [str(exc)]}, status=status.HTTP_400_BAD_REQUEST)
        except NotImplementedError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_501_NOT_IMPLEMENTED)

        mark_payment_completed(payment, result)

        return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)


class PaymentVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get('payment_id')

        if not payment_id:
            return Response({'payment_id': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = (
                Payment.objects
                .select_related('booking')
                .get(id=payment_id, booking__family_member=request.user)
            )
        except Payment.DoesNotExist:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        gateway = get_gateway(payment.gateway)
        try:
            result = gateway.verify_payment(payment, request.data)
        except ValueError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except NotImplementedError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_501_NOT_IMPLEMENTED)

        if result.success:
            mark_payment_completed(payment, result)

        return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)


class PaymentWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, gateway):
        selected_gateway = str(gateway).upper()
        gateway_client = get_gateway(selected_gateway)

        try:
            result = gateway_client.handle_webhook(request.data, dict(request.headers))
        except NotImplementedError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_501_NOT_IMPLEMENTED)

        return Response({'received': result.success}, status=status.HTTP_200_OK)
