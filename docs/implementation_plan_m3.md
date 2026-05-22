# Milestone 3: MVP API and Customer Frontend Flow

This is a major milestone where we connect the backend database to a functional customer-facing Next.js frontend. We will build the backend APIs first, then scaffold the frontend application and build its pages.

## User Review Required

> [!IMPORTANT]
> The Next.js frontend initialization requires several npm commands. I will run these commands, but be aware it will install `next`, `react`, `tailwindcss`, `shadcn/ui`, and other libraries in the `frontend` folder.
> 
> **Authentication Choice**: The README does not specify which authentication method to use for the API. Given the decoupled Next.js/Django architecture, I propose using Django REST Framework's built-in `TokenAuthentication`. This requires adding `rest_framework.authtoken` to our installed apps. 

## Open Questions

None. The requirements from the README are clear.

## Proposed Changes

### Phase 1: Backend API
We will add `rest_framework.authtoken` to `settings.py` and run a migration to create the token tables.
We will create `serializers.py`, `views.py`, and `urls.py` in the relevant apps:

#### `users` API
- Endpoints to register a new family member account and log in (obtain auth token).

#### `services` API
- `GET /api/cities/`
- `GET /api/service-areas/`
- `GET /api/services/`
- `GET /api/pricing/`

#### `patients` API
- `GET /api/patients/` (list the family member's patients)
- `POST /api/patients/` (create a new patient)

#### `bookings` API
- `GET /api/bookings/` (list my bookings)
- `POST /api/bookings/` (create a booking request)

#### `records` API
- `GET /api/records/` (list my patients' medical records)

### Phase 2: Frontend Setup
1. Run `npx create-next-app@latest .` inside `frontend/`.
2. Install dependencies: `npm install axios react-hook-form zod @hookform/resolvers`.
3. Initialize `shadcn/ui` and install components (`button`, `input`, `card`, `form`, `label`, `select`, `table`, `badge`).
4. Setup `src/lib/api.ts` with Axios base configuration pointing to `http://127.0.0.1:8000/api`.

### Phase 3: Frontend Pages
We will build out the UI pages in Next.js using the App Router (`src/app/`):
- `/`: Landing page outlining the service.
- `/login` & `/register`: Authentication.
- `/dashboard`: Family member overview.
- `/patients/new`: Add a parent/patient profile.
- `/services`: Service catalog and pricing.
- `/book`: Booking request form.
- `/bookings`: Status tracking for requested bookings.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- We will start both the Next.js and Django servers.
- We will manually register a user on the Next.js frontend, add a patient profile, and request a booking.
- We will verify the booking appears in the Django Admin and that its status is reflected on the frontend dashboard.
