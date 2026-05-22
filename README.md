# HealthFromHome MVP

HealthFromHome is a web-based healthcare coordination MVP for families abroad who need to coordinate non-emergency care for elderly parents or patients in Kathmandu Valley.

The MVP proves this core flow:

```text
Family registers -> adds patient -> requests service -> admin reviews -> admin assigns provider
-> admin tracks payment/report/reminder -> family views status and updates
```

This is a coordination platform, not an emergency service, AI diagnosis tool, online pharmacy, or full hospital integration.

## Current Features

### Customer frontend

- Public landing page
- Public service/pricing page with filters
- Family registration and login
- Family dashboard
- Patient profile creation
- Booking request flow
- Booking list and booking detail page
- Status timeline and "what happens next" guidance
- Provider assignment visibility
- Local mock "Pay now" flow for Visa/Mastercard, Khalti, and eSewa
- Payment method and payment status visibility
- Medical records page with filters
- Reminder visibility on dashboard
- Account/profile page
- Public contact, privacy, terms, and emergency disclaimer pages

### Admin workflow

- Django Admin operations panel
- City, service area, service, and pricing management
- Booking status management
- Provider profile management
- Provider assignment inline on booking
- Payment inline on booking
- Medical record upload inline on booking
- Manual reminders
- Admin quick actions for booking/payment/reminder status changes

## Tech Stack

Backend:

```text
Python
Django
Django REST Framework
PostgreSQL
django-cors-headers
python-decouple
Pillow
```

Frontend:

```text
Next.js
React
TypeScript
Tailwind CSS
Axios
React Hook Form
Zod
lucide-react
```

Local infrastructure:

```text
PostgreSQL using Docker
Redis container reserved for later work
Django running locally
Next.js running locally
Local media folder for uploads
```

## Project Structure

```text
healthfromhome/
  backend/
  frontend/
  docs/
  docker-compose.yml
  README.md
```

## Local Setup

### 1. Start Docker

Open Docker Desktop first, then run:

```powershell
cd D:\healthfromhome
docker compose up -d
```

### 2. Backend

```powershell
cd D:\healthfromhome\backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

Backend URLs:

```text
Backend root: http://127.0.0.1:8000/
Health check:  http://127.0.0.1:8000/api/health/
Admin:        http://127.0.0.1:8000/admin/
API root:     http://127.0.0.1:8000/api/
```

If you need an admin user:

```powershell
python manage.py createsuperuser
```

### 3. Frontend

```powershell
cd D:\healthfromhome\frontend
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Environment Files

Use these examples:

```text
backend/.env.example
frontend/.env.local.example
```

Local backend `.env`:

```env
DEBUG=True
SECRET_KEY=local-dev-secret-key-change-later
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

DB_NAME=healthfromhome
DB_USER=healthfromhome_user
DB_PASSWORD=healthfromhome_password
DB_HOST=localhost
DB_PORT=5432

MEDIA_URL=/media/
MEDIA_ROOT=media/
```

Local frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## Seed Demo Data

Run this after migrations:

```powershell
cd D:\healthfromhome\backend
.\venv\Scripts\activate
python manage.py seed_demo
```

This creates:

- Kathmandu, Lalitpur, Bhaktapur
- Inside Ring Road and Outside Ring Road service areas
- Demo services and pricing
- Demo provider user/profile

Demo provider:

```text
Username: demo_nurse
Password: DemoProvider123!
```

## Manual Test Flow

1. Run `python manage.py seed_demo`.
2. Open frontend: `http://localhost:3000`.
3. Browse `/services`.
4. Register a family account.
5. Login.
6. Add patient profile.
7. Request a service.
8. Open Django Admin.
9. Open the booking.
10. Assign provider, add payment, upload record, add reminder.
11. Update booking status.
12. Open the booking detail page and test local mock payment:
    - Click `Pay now`
    - Choose Visa/Mastercard, Khalti, or eSewa
    - For card, use `4242 4242 4242 4242`, any future expiry, and any CVC
    - For Khalti/eSewa, use any test wallet phone number such as `9800000000`
13. Return to frontend and check:
    - `/dashboard`
    - `/bookings`
    - `/bookings/[id]`
    - `/records`
    - `/account`

See full checklist:

```text
docs/manual_qa_checklist.md
```

## API Endpoints

Public:

```text
GET  /api/health/
POST /api/users/register/
POST /api/users/login/
GET  /api/services/cities/
GET  /api/services/service-areas/
GET  /api/services/services/
GET  /api/services/pricing/
```

Authenticated:

```text
GET  /api/users/me/
GET  /api/patients/
POST /api/patients/
GET  /api/bookings/
POST /api/bookings/
GET  /api/bookings/{id}/
POST /api/payments/start/
POST /api/payments/confirm-mock/
POST /api/payments/verify/
POST /api/payments/webhooks/{gateway}/
GET  /api/records/
GET  /api/reminders/
```

## Verification Commands

Backend:

```powershell
cd D:\healthfromhome\backend
.\venv\Scripts\activate
python manage.py check
python manage.py test users bookings records notifications
```

Frontend:

```powershell
cd D:\healthfromhome\frontend
npm run lint
npm run build
```

## Important MVP Limits

- Non-emergency coordination only.
- No AI diagnosis.
- No mobile app yet.
- No online pharmacy yet.
- No automated payment gateway yet.
- Local mock payment is for testing only and does not charge real cards or connect to real Khalti/eSewa wallets.
- No SMS/WhatsApp/email automation yet.
- Medical uploads are local in development.
- Do not use real patient data during development.

See production notes and deployment guide:

```text
docs/production_readiness.md
docs/deployment_guide.md
docs/payment_gateway_plan.md
```

## Suggested Next Milestones

1. Replace placeholder support and legal copy with reviewed pilot content.
2. Add production object storage for medical records.
3. Add email/SMS/WhatsApp reminder integration.
4. Add provider portal.
5. Prepare pilot deployment.
