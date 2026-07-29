# Production readiness backlog

- [x] Separate frontend and standalone API Docker images
- [x] PostgreSQL deployment configuration and API health check
- [x] Transactional checkout/check-in
- [x] Server-side CSV/XLS/XLSX tablet update import
- [x] Remove password fallback and fake participant submission
- [ ] Move remaining CRUD, auth, request, and activity handlers exclusively to the API container
- [ ] Replace opaque auth cookie with signed/session-backed authentication and enforce roles on every mutation
- [ ] Add API/UI integration tests and migration/backup runbooks
- [ ] Wire or remove simulated bulk issuance, notifications, scheduled exports, and settings integrations
