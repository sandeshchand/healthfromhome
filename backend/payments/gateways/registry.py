from .mock import MockPaymentGateway
from .placeholders import NotConfiguredPaymentGateway


def get_gateway(gateway_name):
    if gateway_name == 'MOCK':
        return MockPaymentGateway()

    return NotConfiguredPaymentGateway(gateway_name)
