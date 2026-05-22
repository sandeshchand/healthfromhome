from uuid import uuid4

from .base import BasePaymentGateway, PaymentResult


class MockPaymentGateway(BasePaymentGateway):
    gateway_name = 'MOCK'

    def start_payment(self, payment):
        reference = f"{payment.payment_method}-MOCK-SESSION-{uuid4().hex[:12].upper()}"
        return PaymentResult(
            success=True,
            gateway_payment_id=reference,
            gateway_reference=reference,
            gateway_response={
                'mode': 'local_mock',
                'payment_method': payment.payment_method,
            },
        )

    def confirm_payment(self, payment, payload):
        reference_suffix = self._reference_suffix(payment, payload)
        transaction_id = f"{payment.payment_method}-MOCK-{uuid4().hex[:12].upper()}-{reference_suffix}"
        return PaymentResult(
            success=True,
            transaction_id=transaction_id,
            gateway_payment_id=payment.gateway_payment_id,
            gateway_reference=payment.gateway_reference or transaction_id,
            gateway_response={
                'mode': 'local_mock',
                'payment_method': payment.payment_method,
                'reference_suffix': reference_suffix,
            },
        )

    def verify_payment(self, payment, payload):
        if payment.status == 'COMPLETED':
            return PaymentResult(
                success=True,
                transaction_id=payment.transaction_id,
                gateway_payment_id=payment.gateway_payment_id,
                gateway_reference=payment.gateway_reference,
                gateway_response={'mode': 'local_mock', 'already_completed': True},
            )

        return self.confirm_payment(payment, payload)

    def handle_webhook(self, payload, headers=None):
        return PaymentResult(
            success=True,
            gateway_response={
                'mode': 'local_mock',
                'payload': payload,
                'headers': headers or {},
            },
        )

    def _reference_suffix(self, payment, payload):
        if payment.payment_method == 'CARD':
            card_last4 = str(payload.get('card_last4', '')).strip()
            if len(card_last4) != 4 or not card_last4.isdigit():
                raise ValueError('Enter the last 4 digits of the mock card.')
            return card_last4

        wallet_phone = str(payload.get('wallet_phone', '')).strip()
        wallet_digits = ''.join(char for char in wallet_phone if char.isdigit())
        if len(wallet_digits) < 8:
            raise ValueError('Enter a valid mock wallet phone number.')
        return wallet_digits[-4:]
