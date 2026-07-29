# Capability audit

## Fixed in this pass

- The Prisma model now has participant timestamps, fixing the participant list query.
- Checkout and check-in are database transactions. They validate availability, prevent duplicate active assignments, update the tablet and participant together, and return conflict responses instead of false success.
- `.csv`, `.xlsx`, and `.xls` imports are parsed with `xlsx`. Tablet imports update existing records by `deviceId`, `serialNumber`, or `IMEI`; unknown identifiers and invalid rows are reported individually.
- Participant creation now persists through the API instead of waiting and logging a fake submission.
- Demo-password login bypasses were removed. Seed credentials must be supplied explicitly through environment variables.
- The UI and API have separate Docker images, PostgreSQL configuration, health checks, security headers, upload limits, and an API container entry point.

## Still requiring operational decisions

- The legacy Next route handlers remain as a development fallback while the standalone API is introduced. Production should route `/api/*` through the backend service after the remaining CRUD/auth routes are moved there.
- Session tokens are currently short-lived opaque user-id cookies; replace them with a signed, server-side session or an OIDC provider before external exposure.
- Bulk issuance, participant import, exports, SMS/email actions, scheduled exports, and several admin/settings cards are still UI-only or simulated. They should be disabled or wired to audited API endpoints before high-stakes use.
- Existing seed data is demonstration data. Do not run `prisma db seed` against a production database; use an approved data migration/import process.
- Add automated API tests, role-based authorization tests, backups/restore drills, audit-log assertions, and observability before go-live.

## Import format

For tablet updates, include `deviceId` (preferred), `serialNumber`, or `IMEI` plus any fields to change, for example `status`, `condition`, `battery`, `location`, `lastChecked`, and `notes`. The import endpoint never creates an unidentified tablet.
