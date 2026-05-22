from dataclasses import dataclass


@dataclass
class PaymentResult:
    success: bool
    transaction_id: str = ''
    gateway_payment_id: str = ''
    gateway_reference: str = ''
    gateway_response: dict | None = None
    failure_reason: str = ''


class BasePaymentGateway:
    gateway_name = ''

    def start_payment(self, payment):
        raise NotImplementedError

    def confirm_payment(self, payment, payload):
        raise NotImplementedError

    def verify_payment(self, payment, payload):
        raise NotImplementedError

    def handle_webhook(self, payload, headers=None):
        raise NotImplementedError
