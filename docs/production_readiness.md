# Production Readiness Notes

This MVP is ready for local demos and pilot preparation, not production deployment yet.

## Must Do Before Production

- Replace `SECRET_KEY` with a secure production secret.
- Set `DEBUG=False`.
- Configure `ALLOWED_HOSTS` for the production domain.
- Restrict CORS to the production frontend domain.
- Use strong admin passwords and remove demo accounts.
- Do not use local `media/` storage for long-term production medical records.
- Add database backup and restore process.
- Review permissions for medical record access.
- Add HTTPS/TLS through the hosting layer.
- Add logging and error monitoring.

## Data Safety

- Do not use real patient data in development.
- Store only necessary patient information.
- Keep medical records private to the owning family account.
- Document who on the admin team can view reports.

## Known MVP Limitations

- Payments are manually tracked by admin.
- Reminders are manually created and shown in-app only.
- No SMS, WhatsApp, or email automation yet.
- No emergency response workflow.
- No provider self-service portal.
- No production object storage integration yet.

## Recommended Pilot Readiness Work

- Create a small set of real service packages and pricing rules.
- Define manual payment collection process.
- Define admin standard operating procedure for booking statuses.
- Replace placeholder support/contact information with real pilot details.
- Replace draft terms, privacy, and emergency disclaimer pages with reviewed content.

## Related Guide

See `docs/deployment_guide.md` for the pilot deployment checklist and verification commands.
