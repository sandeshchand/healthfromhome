# Medical Data Handling Guide

This guide explains how HealthFromHome should handle medical reports during MVP, pilot, and production stages.

## Current MVP Behavior

Medical records are uploaded by admin through Django Admin.

Current model:

```text
MedicalRecord
- patient
- booking
- title
- description
- file
- original_filename
- file_size
- content_type
- storage_backend
- uploaded_by
- uploaded_at
```

Current storage:

```text
backend/media/medical_records/YYYY/MM/DD/
```

Current customer access:

- Family users can view only records connected to their own patient profiles.
- The records API filters by `patient__family_member=request.user`.
- File downloads use `/api/records/{id}/download/`, which checks family ownership before returning the file.
- View/download events are logged in `MedicalRecordAccessLog`.
- Records can be listed on `/records`.
- Records linked to a booking appear on `/bookings/{id}`.

This is acceptable for local development and controlled demos only.

## What Not To Do

- Do not use real patient documents in development.
- Do not commit uploaded files to Git.
- Do not store medical documents in a public bucket.
- Do not expose permanent public file URLs in production.
- Do not allow users to guess or access files by direct path.
- Do not store unnecessary medical data.

## Production Storage Target

For production, medical reports should move from local disk to private object storage.

Good options:

- AWS S3 private bucket
- DigitalOcean Spaces private bucket
- Azure Blob private container
- Google Cloud Storage private bucket

Recommended production flow:

```text
Admin uploads report
Backend validates file
Backend stores file in private object storage
Database stores file reference and metadata
Family user requests record
Backend checks patient ownership
Backend returns short-lived signed download/view URL
```

## Upload Validation Requirements

Implemented MVP validation:

- Allowed file types: PDF, JPG, JPEG, PNG
- Maximum file size: 10 MB
- Safe generated storage filename
- Content type metadata

Still recommended before full production:

- Empty file rejection hardening
- Optional malware scan before long-term storage

Implemented model fields:

```text
file_size
content_type
original_filename
storage_backend
uploaded_by
```

## Access Control Rules

Family users:

- Can list records only for their own patients.
- Can view/download only records for their own patients.
- Cannot upload medical records in the current MVP.
- Cannot view records belonging to another family account.

Admin users:

- Can upload records.
- Can link records to patient and booking.
- Should only access records required for operations.

Provider users:

- No provider-facing record access exists yet.
- If added later, provider access should be limited to assigned bookings only.

## Audit Log Plan

Production should track access to sensitive records. The MVP now logs family view/download access.

Recommended audit events:

- `VIEWED`
- `DOWNLOADED`

Future audit events:

- `RECORD_UPLOADED`
- `RECORD_DELETED`
- `RECORD_LINKED_TO_BOOKING`

Recommended audit fields:

```text
actor
actor_role
patient
medical_record
booking
action
timestamp
ip_address
user_agent
metadata
```

Audit logs should be read-only for normal admins.

## Retention Policy Placeholder

Before production, define:

- How long medical reports are stored.
- Who can request deletion.
- Whether records are archived after booking completion.
- How backups handle deleted records.
- How long audit logs are retained.

Suggested MVP pilot default:

```text
Keep records during pilot unless deletion is requested by the family or required by policy.
Review retention rules before real launch.
```

## Backup Requirements

Production backups should include:

- PostgreSQL database
- Private object storage files
- Mapping between database records and storage object keys

Backups should be:

- Encrypted
- Tested for restore
- Access limited to trusted operators
- Kept separate from the running app environment

## Implementation Checklist

Next coding steps:

1. Done - Add file metadata fields to `MedicalRecord`.
2. Done - Add upload validation for file type and size.
3. Done - Add safe filename generation.
4. Done - Add `MedicalRecordAccessLog` model.
5. Done - Add audit logging when family users view or download records.
6. Done - Replace direct media URLs with permission-checked download endpoint.
7. Next - Add private object storage integration.
8. Next - Add signed URL generation for production.
9. Done - Add tests for file validation and access audit.

## Current Risk Level

For local demo:

```text
Acceptable
```

For real patient pilot:

```text
Needs improvement before use
```

For production:

```text
Not ready until private storage, validation, signed URLs, audit logs, and retention policy are implemented.
```
