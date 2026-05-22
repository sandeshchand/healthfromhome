from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = (
            'id',
            'booking',
            'amount',
            'currency',
            'payment_method',
            'gateway',
            'status',
            'transaction_id',
            'gateway_payment_id',
            'gateway_reference',
            'paid_at',
            'failure_reason',
            'created_at',
            'updated_at',
        )
        read_only_fields = fields
