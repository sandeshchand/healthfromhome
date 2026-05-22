# HealthFromHome Manual QA Checklist

Use only demo data. Do not enter real patient information during local testing.

## Startup

- Start Docker Desktop.
- Run `docker compose up -d`.
- Run backend: `cd backend`, activate venv, then `python manage.py runserver`.
- Run frontend: `cd frontend`, then `npm run dev`.
- Confirm backend root opens: `http://127.0.0.1:8000/`.
- Confirm frontend opens: `http://localhost:3000`.

## Demo Data

- Run `python manage.py seed_demo`.
- Confirm services appear on `/services`.
- Confirm `demo_nurse` provider exists in Django Admin.

## Customer Flow

- Register a new family account.
- Login.
- Add a patient profile.
- Browse services and filter by city/service area/service type.
- Click `Book this service`.
- Submit a booking request.
- Open `/bookings` and confirm booking appears.
- Open booking detail page and confirm status timeline appears.

## Admin Flow

- Login to Django Admin.
- Open the booking.
- Change status to `UNDER_REVIEW`.
- Add payment inline.
- Assign provider inline.
- Upload medical record inline.
- Add reminder from `Notifications -> Reminders`.
- Change status to `ASSIGNED`, then `COMPLETED`.

## Customer Verification

- Refresh dashboard and confirm priority booking/reminder counts.
- Open booking detail and confirm provider/payment/report are visible.
- Open `/records` and filter by patient/booking.
- Open `/account` and confirm account details.
- Logout and confirm protected pages redirect to login.

## Regression Checks

- `python manage.py check`
- `python manage.py test users bookings records notifications`
- `npm run lint`
- `npm run build`
