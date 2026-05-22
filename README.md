# HealthFromHome MVP

HealthFromHome is a healthcare coordination SaaS platform for elderly patients in Kathmandu Valley whose children or family members live abroad. The platform helps families coordinate non-emergency healthcare services such as hospital pickup, doctor appointments, nurse visits, lab sample collection, medical record storage, follow-up reminders, and care packages.

The first MVP will be a web-based application. Mobile application, online pharmacy, remote patient monitoring, physical clinic/lab, and expansion to other cities will come later.

---

## 1. MVP Goal

The goal of the MVP is to prove this core business flow:

```text
Family member registers
→ Adds parent/patient profile
→ Selects health service
→ Requests booking
→ Admin reviews request
→ Admin assigns provider
→ Service is completed
→ Report/status is uploaded
→ Family receives update
```

The MVP should focus on care coordination, not full medical automation.

---

## 2. Phase 1 Services

Phase 1 services include:

1. Non-emergency medical transportation
2. Mobile healthcare booking
3. Doctor appointment coordination
4. Lab sample collection and online reports
5. On-demand clinician home visit
6. On-demand nurse visit
7. On-demand physiotherapist
8. Prescribed medicine delivery coordination
9. Patient account and medical record storage
10. Telephone/email alerts for follow-up, lab tests, and medication reminders
11. Professional registration for doctors, nurses, and physiotherapists
12. Hospital listing
13. Appointment-based, distance-based, and subscription-based payments

For the first MVP, we will not build everything at once. We will start with the minimum usable booking and admin system.

---

## 3. MVP Scope

### Build in MVP

1. Landing page
2. Family member registration and login
3. Patient/parent profile creation
4. Service catalog
5. Kathmandu Valley service area and pricing
6. Booking request
7. Admin dashboard using Django Admin
8. Provider profile management
9. Provider assignment
10. Booking status tracking
11. Medical report/file upload
12. Manual payment status tracking
13. Basic email/phone reminder tracking

### Do Not Build in First MVP

1. Full mobile app
2. Open doctor marketplace
3. Online pharmacy
4. AI diagnosis
5. Remote patient monitoring
6. Automatic recurring billing
7. Full hospital API integration
8. Complex provider payout system
9. Kubernetes/microservices
10. Advanced analytics dashboard

---

## 4. Tech Stack

### Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Axios
React Hook Form
Zod
```

### Backend

```text
Python
Django
Django REST Framework
Django Admin
PostgreSQL
django-cors-headers
python-decouple
Pillow
```

### Local Infrastructure

```text
PostgreSQL using Docker
Django running locally with Python virtual environment
Next.js running locally with npm
Local media folder for file uploads
```

### Later Infrastructure

```text
Redis
Celery
Object storage
SMS/WhatsApp/email integration
Payment gateway
Production VPS or cloud deployment
```

---

## 5. Why This Architecture?

We use both React/Next.js and Django.

```text
React/Next.js = frontend user interface
Django = backend logic, database, admin, permissions, bookings, reports
PostgreSQL = reliable production-grade database
Django Admin = fast MVP operations dashboard
```

This keeps development fast but still scalable for Phase 2 and Phase 3.

---

## 6. Local Machine Requirements

Install these tools before coding:

```text
VS Code
Git
Python
Node.js LTS
Docker Desktop
Postman or Bruno
```

Recommended VS Code extensions:

```text
Python
Pylance
Django
ESLint
Prettier
Tailwind CSS IntelliSense
Docker
GitLens
PostgreSQL
REST Client
```

Check installations:

```powershell
git --version
python --version
pip --version
node --version
npm --version
docker --version
docker compose version
```

---

## 7. Project Folder Structure

Create this structure:

```text
healthfromhome/
  backend/
  frontend/
  docs/
  docker-compose.yml
  README.md
  .gitignore
```

Commands:

```powershell
cd D:\
mkdir healthfromhome
cd healthfromhome
mkdir backend frontend docs
git init
```

---

## 8. .gitignore

Create `.gitignore` in the root folder:

```gitignore
# Python
__pycache__/
*.pyc
venv/
.env

# Django
media/
staticfiles/
db.sqlite3

# Node
node_modules/
.next/
out/

# VS Code
.vscode/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

---

## 9. Docker Setup for PostgreSQL

For now, Docker is used only for PostgreSQL. Django and Next.js will run directly on the local machine.

Create `docker-compose.yml` in the root folder:

```yaml
services:
  db:
    image: postgres:16
    container_name: healthfromhome_db
    restart: always
    environment:
      POSTGRES_DB: healthfromhome
      POSTGRES_USER: healthfromhome_user
      POSTGRES_PASSWORD: healthfromhome_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data/

volumes:
  postgres_data:
```

Start PostgreSQL:

```powershell
docker compose up -d
```

Check container:

```powershell
docker ps
```

Stop database:

```powershell
docker compose down
```

Stop and delete database volume:

```powershell
docker compose down -v
```

Use `down -v` only when you want to delete all local database data.

---

## 10. Backend Setup

Go to backend folder:

```powershell
cd D:\healthfromhome\backend
```

Create virtual environment:

```powershell
python -m venv venv
```

Activate virtual environment:

```powershell
.\venv\Scripts\activate
```

Upgrade pip:

```powershell
python -m pip install --upgrade pip
```

Install backend libraries:

```powershell
pip install django djangorestframework django-cors-headers psycopg2-binary python-decouple pillow
```

Create Django project:

```powershell
django-admin startproject config .
```

Create Django apps:

```powershell
python manage.py startapp users
python manage.py startapp patients
python manage.py startapp services
python manage.py startapp bookings
python manage.py startapp providers
python manage.py startapp records
python manage.py startapp payments
python manage.py startapp notifications
```

---

## 11. Backend Environment Variables

Create `.env` inside `backend/`:

```env
DEBUG=True
SECRET_KEY=local-dev-secret-key-change-later
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=healthfromhome
DB_USER=healthfromhome_user
DB_PASSWORD=healthfromhome_password
DB_HOST=localhost
DB_PORT=5432

MEDIA_URL=/media/
MEDIA_ROOT=media/
```

---

## 12. Django Settings

Open:

```text
backend/config/settings.py
```

Add imports:

```python
from decouple import config
```

Update `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # Django default apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party apps
    "rest_framework",
    "corsheaders",

    # Local apps
    "users",
    "patients",
    "services",
    "bookings",
    "providers",
    "records",
    "payments",
    "notifications",
]
```

Add CORS middleware near the top of `MIDDLEWARE`:

```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
```

Add CORS origin:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

Update database settings:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT"),
    }
}
```

Add media settings at the bottom:

```python
MEDIA_URL = config("MEDIA_URL", default="/media/")
MEDIA_ROOT = BASE_DIR / config("MEDIA_ROOT", default="media")
```

---

## 13. Backend Test

Run migrations:

```powershell
python manage.py migrate
```

Create admin user:

```powershell
python manage.py createsuperuser
```

Run backend server:

```powershell
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/admin/
```

If Django Admin opens, backend setup is successful.

---

## 14. Frontend Setup

Open a new terminal:

```powershell
cd D:\healthfromhome\frontend
```

Create Next.js app:

```powershell
npx create-next-app@latest .
```

Recommended options:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: Yes
```

Run frontend:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 15. Frontend Libraries

Install common libraries:

```powershell
npm install axios react-hook-form zod @hookform/resolvers
```

Initialize shadcn/ui:

```powershell
npx shadcn@latest init
```

Add useful UI components:

```powershell
npx shadcn@latest add button input card form label textarea select dialog table badge
```

---

## 16. Frontend API Client

Create:

```text
frontend/src/lib/api.ts
```

Add:

```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

Create `.env.local` inside `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## 17. Daily Startup Commands

### Terminal 1: PostgreSQL

```powershell
cd D:\healthfromhome
docker compose up -d
```

### Terminal 2: Django Backend

```powershell
cd D:\healthfromhome\backend
.\venv\Scripts\activate
python manage.py runserver
```

### Terminal 3: Next.js Frontend

```powershell
cd D:\healthfromhome\frontend
npm run dev
```

URLs:

```text
Frontend: http://localhost:3000
Backend:  http://127.0.0.1:8000
Admin:    http://127.0.0.1:8000/admin/
```

---

## 18. Core Database Modules

Initial modules:

```text
User
PatientProfile
City
ServiceArea
Service
ServicePricing
ProviderProfile
Booking
BookingAssignment
MedicalRecord
Payment
SubscriptionPlan
PatientSubscription
Notification
AuditLog
```

---

## 19. Kathmandu Valley Pricing Design

Pricing should not be hardcoded.

Use these models:

```text
City
- Kathmandu
- Lalitpur
- Bhaktapur
- Pokhara later
- Chitwan later

ServiceArea
- Inside Ring Road
- Outside Ring Road within 30 km
- Outside Valley later

ServicePricing
- service
- city
- service_area
- base_price
- price_per_km
- night_charge
- weekend_charge
- active
```

This makes future expansion easier.

---

## 20. Booking Status Flow

Use clear booking statuses:

```text
REQUESTED
UNDER_REVIEW
PAYMENT_PENDING
CONFIRMED
ASSIGNED
IN_PROGRESS
COMPLETED
CANCELLED
FOLLOW_UP_REQUIRED
```

Example flow:

```text
Family requests nurse visit
→ Admin reviews request
→ Admin confirms price
→ Payment pending
→ Payment received
→ Nurse assigned
→ Visit completed
→ Report uploaded
→ Follow-up scheduled
```

---

## 21. Milestone 1: Local Foundation and Backend Admin

### Goal

Set up the full local environment and create the backend foundation.

### Tasks

1. Create Git repository
2. Create folder structure
3. Create `.gitignore`
4. Add PostgreSQL Docker setup
5. Create Django backend
6. Connect Django to PostgreSQL
7. Install Django REST Framework and CORS
8. Create Django apps
9. Run migrations
10. Create superuser
11. Open Django Admin successfully

### Deliverables

```text
Django project running
PostgreSQL running in Docker
Django Admin accessible
All backend apps created
README updated
Initial Git commit created
```

### Success Criteria

```text
docker ps shows healthfromhome_db
python manage.py migrate works
python manage.py runserver works
/admin opens successfully
```

### Suggested Git Commit

```powershell
git add .
git commit -m "Milestone 1: setup local backend environment"
```

---

## 22. Milestone 2: Core Data Models and Admin Workflow

### Goal

Create the core database models required for the MVP booking flow.

### Tasks

1. Create custom user or role profile model
2. Create PatientProfile model
3. Create City model
4. Create ServiceArea model
5. Create Service model
6. Create ServicePricing model
7. Create ProviderProfile model
8. Create Booking model
9. Create BookingAssignment model
10. Create MedicalRecord model
11. Create Payment model
12. Register all models in Django Admin
13. Add list filters, search fields, and admin display fields
14. Create initial service data manually from Django Admin

### Deliverables

```text
Database models created
Django migrations generated
Models visible in Django Admin
Admin can create patient, service, pricing, provider, booking, payment, and record
```

### Success Criteria

```text
Admin can create a patient profile
Admin can create Kathmandu city
Admin can create inside/outside ring road service areas
Admin can create services
Admin can create pricing
Admin can create booking request
Admin can assign provider
Admin can upload medical record
```

### Suggested Git Commit

```powershell
git add .
git commit -m "Milestone 2: add core MVP data models and admin workflow"
```

---

## 23. Milestone 3: MVP API and Customer Frontend Flow

### Goal

Allow family members to use the web app to create patient profiles and request services.

### Backend Tasks

1. Add API serializers
2. Add API views/viewsets
3. Add API routes
4. Create endpoints for:
   - service list
   - city list
   - service area list
   - patient create/list/detail
   - booking create/list/detail
   - medical record list
5. Add basic authentication
6. Add permission checks
7. Add CORS connection with frontend

### Frontend Tasks

1. Create landing page
2. Create register/login pages
3. Create dashboard page
4. Create add patient page
5. Create service list page
6. Create booking request page
7. Create my bookings page
8. Connect frontend to backend API using Axios
9. Add form validation using React Hook Form and Zod
10. Display booking status to family member

### Deliverables

```text
Frontend running
Backend API running
Family member can create patient profile
Family member can request service
Admin can see booking in Django Admin
Family member can view booking status
```

### Success Criteria

```text
Customer can open frontend
Customer can add parent profile
Customer can request nurse/doctor/lab/transport service
Booking appears in Django Admin
Admin can update status
Frontend shows updated booking status
```

### Suggested Git Commit

```powershell
git add .
git commit -m "Milestone 3: add MVP API and customer booking frontend"
```

---

## 24. After Milestone 3

After Milestone 3, continue with:

```text
Milestone 4: Medical record upload and family record view
Milestone 5: Manual payment flow and invoice tracking
Milestone 6: Notifications and reminder scheduling
Milestone 7: Subscription packages
Milestone 8: Pilot testing with real users
Milestone 9: Production hardening
Milestone 10: Mobile app planning
```

---

## 25. Development Rules

1. Build the backend business flow first.
2. Do not overdesign frontend in the beginning.
3. Use Django Admin as the first internal dashboard.
4. Keep medical records private.
5. Do not store unnecessary patient data.
6. Do not hardcode pricing.
7. Keep city and service area configurable.
8. Use migrations for every database change.
9. Commit after every stable milestone.
10. Do not add AI diagnosis in MVP.
11. Do not build mobile app before web MVP is validated.
12. Do not use real patient data during development.
13. Keep `.env` out of GitHub.
14. Backup data before database changes.
15. Keep the first MVP simple and operational.

---

## 26. First Coding Priority

Start with this exact order:

```text
1. Create project folder
2. Start PostgreSQL in Docker
3. Create Django backend
4. Connect Django to PostgreSQL
5. Open Django Admin
6. Create core models
7. Register models in Admin
8. Create basic API
9. Create Next.js frontend
10. Connect frontend to backend
```

The first real feature should be:

```text
Family member registers
→ Adds parent profile
→ Requests service
→ Admin sees booking
→ Admin updates status
→ Family sees status
```

That is the HealthFromHome MVP core.
