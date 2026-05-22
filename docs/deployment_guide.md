# Deployment Guide

This guide is for moving the MVP from local demo to a controlled pilot. It is not a final production operations manual.

## Pre-Deployment Checklist

- Replace demo data and demo users.
- Set `DEBUG=False`.
- Use a strong `SECRET_KEY`.
- Configure `ALLOWED_HOSTS` for the real backend domain.
- Restrict CORS to the real frontend domain.
- Configure HTTPS at the hosting layer.
- Move uploaded medical files out of local disk storage.
- Confirm medical file validation and access audit logging are enabled.
- Add private object storage and signed URLs before real production use.
- Confirm backup and restore steps for PostgreSQL.
- Review admin access for bookings, payments, and medical records.
- Replace placeholder contact details in `/contact`.
- Replace draft legal pages with reviewed terms, privacy, and emergency disclaimer content.
- Replace local mock payment with real Visa/Mastercard, Khalti, and eSewa gateway integrations before charging customers.

## Backend Environment

Required production-style variables:

```env
DEBUG=False
SECRET_KEY=replace-with-secure-secret
ALLOWED_HOSTS=api.example.com
CORS_ALLOWED_ORIGINS=https://www.example.com

DB_NAME=healthfromhome
DB_USER=healthfromhome_user
DB_PASSWORD=replace-with-secure-password
DB_HOST=production-db-host
DB_PORT=5432

MEDIA_URL=/media/
MEDIA_ROOT=media/
```

## Frontend Environment

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api
```

## Verification Commands

Backend:

```powershell
cd D:\healthfromhome\backend
.\venv\Scripts\python.exe manage.py check
.\venv\Scripts\python.exe manage.py test users bookings records notifications
```

Frontend:

```powershell
cd D:\healthfromhome\frontend
cmd /c npm run lint
cmd /c npm run build
```

## Pilot Launch Steps

1. Create production database and user.
2. Apply migrations.
3. Create a secure superuser.
4. Add real cities, service areas, services, pricing, and providers.
5. Configure media storage and backup policy.
6. Deploy backend and frontend.
7. Confirm register, login, patient create, booking request, admin assignment, payment tracking, record upload, and reminder display.
8. Run one complete manual QA pass using `docs/manual_qa_checklist.md`.
9. Review `docs/medical_data_handling.md` before using real medical documents.

## Known Gaps Before Full Production

- No automated email, SMS, or WhatsApp notifications.
- No real payment gateway integration. The current Pay now flow supports local mock Visa/Mastercard, Khalti, and eSewa payments only.
- No provider self-service portal.
- No production object storage implementation.
- Family medical record view/download audit logging exists.
- No formal audit log for admin medical record access yet.
- Medical record downloads are permission-checked locally but should use private object storage and signed URLs for production.
- No automated uptime monitoring or error tracking.

## Payment Gateway Notes

The payment module now has gateway-ready fields and service classes. See `docs/payment_gateway_plan.md` before adding real Stripe, Khalti, or eSewa credentials.
