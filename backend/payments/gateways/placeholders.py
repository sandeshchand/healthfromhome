from .base import BasePaymentGateway


class NotConfiguredPaymentGateway(BasePaymentGateway):
    def __init__(self, gateway_name):
        self.gateway_name = gateway_name

    def start_payment(self, payment):
        raise NotImplementedError(f'{self.gateway_name} gateway is not configured yet.')

    def confirm_payment(self, payment, payload):
        raise NotImplementedError(f'{self.gateway_name} gateway is not configured yet.')

    def verify_payment(self, payment, payload):
        raise NotImplementedError(f'{self.gateway_name} gateway is not configured yet.')

    def handle_webhook(self, payload, headers=None):
        raise NotImplementedError(f'{self.gateway_name} gateway is not configured yet.')
