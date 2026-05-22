# Payment Gateway Plan

The current payment flow is gateway-ready but still uses local mock processing.

## Current Local Flow

- Customer opens a booking detail page.
- Customer clicks `Pay now`.
- Customer chooses Visa/Mastercard, Khalti, or eSewa.
- Backend creates or updates a `Payment`.
- Backend routes the request through `payments/gateways/mock.py`.
- Mock confirmation marks the payment `COMPLETED`.
- Booking status changes to `CONFIRMED`.

No real card, Khalti, or eSewa payment is charged in this flow.

## Gateway Architecture

Payment gateway code lives in:

```text
backend/payments/gateways/
  base.py
  mock.py
  placeholders.py
  registry.py
```

The API views call the gateway layer instead of hard-coding provider behavior in views.

Current endpoints:

```text
POST /api/payments/start/
POST /api/payments/confirm-mock/
POST /api/payments/verify/
POST /api/payments/webhooks/{gateway}/
```

## Production Payment Fields

The `Payment` model now includes:

- `currency`
- `payment_method`
- `gateway`
- `transaction_id`
- `gateway_payment_id`
- `gateway_reference`
- `gateway_response`
- `paid_at`
- `failure_reason`

These fields prepare the app for real provider verification, receipts, reconciliation, and support debugging.

## Real Gateway Implementation Steps

1. Create merchant accounts for the selected providers.
2. Add provider credentials as environment variables.
3. Implement real gateway clients:
   - Stripe or another card provider for Visa/Mastercard
   - Khalti official API
   - eSewa official API
4. Update `payments/gateways/registry.py` to return the real gateway in production.
5. Make `/api/payments/start/` return the provider checkout URL or client secret.
6. Implement `/api/payments/verify/` using provider verification APIs.
7. Implement webhook signature verification.
8. Store provider references in `gateway_payment_id`, `gateway_reference`, and `gateway_response`.
9. Only mark payment `COMPLETED` after trusted provider verification.

## Safety Rule

Do not store raw card numbers, CVC, or full wallet credentials in this app. Card data should be handled by a PCI-compliant payment provider.
