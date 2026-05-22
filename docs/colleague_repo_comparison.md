# Colleague Repo Comparison

Compared repo:

```text
https://github.com/binodbdrchand/healthfromhome
```

## Main Difference

The colleague repo is a TypeScript monorepo:

- Next.js backend API routes
- Next.js frontend
- Drizzle ORM
- SQLite/libSQL
- JWT access/refresh token logic
- Shared Zod schemas

Our current repo is a Django/Next.js split:

- Django REST Framework backend
- PostgreSQL
- Docker Compose for Postgres and Redis
- Django Admin operations workflow
- Next.js customer frontend
- Token authentication
- Payment, booking, record, reminder, and admin workflows

These stacks are not directly compatible, so copying code file-by-file would create more risk than value.

## Useful Ideas Found

The colleague repo has a few good infrastructure/application ideas:

- A health endpoint that checks backend/database availability.
- Environment-driven CORS/frontend origin configuration.
- Shared request/response schemas.
- Access/refresh token lifecycle.
- Explicit role/user/patient/doctor schema separation.
- Seed commands for initial roles.

## Added To Our Repo

These ideas were safe and useful to bring into our codebase:

- Added `GET /api/health/` with database connectivity check.
- Made `ALLOWED_HOSTS` configurable from `.env`.
- Made `CORS_ALLOWED_ORIGINS` configurable from `.env`.
- Updated README and deployment guide with health check and CORS env details.

## Not Copied

These were intentionally not copied:

- Drizzle/SQLite database layer, because our production direction is PostgreSQL with Django ORM.
- Next.js backend API routes, because our backend is Django REST Framework.
- JWT implementation, because the MVP currently uses DRF token auth. A future upgrade should use Django-compatible JWT such as SimpleJWT rather than copying Next middleware.
- Shared TypeScript schemas for backend validation, because Django serializers already own backend validation.

## Future Ideas Worth Considering

- Add refresh-token auth using Django SimpleJWT when session security becomes a priority.
- Add audit logs for medical record view/download events.
- Add a standard API response envelope only if frontend error handling becomes inconsistent.
- Add role-based admin groups for operations, finance, support, and clinical admin.
