# SamadhanSetu — Remaining Work

**Updated:** 2026-09-06

This file now lists only work that remains before the SamadhanSetu SIH prototype can be declared fully verified. Core backend, AI/ML prototype, frontend and API integration work is already implemented.

## 1. Live AI Verification

- [ ] Configure `GEMINI_API_KEY` in the AI service environment.
- [ ] Verify live Gemini translation/summarization/classification.
- [ ] Verify Gemini embeddings + FAISS duplicate detection against real issue data.
- [ ] Confirm AI fallback still works when Gemini/service is unavailable.

## 2. Production/Hosted Configuration

Deployment-specific values must remain outside GitHub:

- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `GEMINI_API_KEY`
- `AI_SERVICE_URL`
- frontend `VITE_API_BASE_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

Never commit private credentials or secrets.

## 3. Hosted Runtime Verification

- [ ] Verify deployed Spring Boot health/API endpoints.
- [ ] Verify deployed AI service connectivity from Spring Boot.
- [ ] Verify frontend can reach the deployed backend.
- [ ] Verify production CORS.
- [ ] Verify JWT login/authenticated requests in the hosted environment.
- [ ] Verify evidence/image upload configuration if Cloudinary is used.
- [ ] Observe successful frontend build workflow in GitHub Actions.

## 4. Final End-to-End Demo

Run one complete real-data workflow without mock fallback:

```text
Citizen registration/login
  → issue + exact GPS + evidence
  → Spring Boot persistence
  → AI translation/summarization/classification/priority/dedup
  → university/department routing
  → Nodal verification
  → Faculty/Student R&D project
  → Kanban task updates
  → milestone validation
  → Industry/CSR sponsorship record
  → Admin analytics/GIS
  → notification/session verification
```

## 5. Demo-Data / UI Cleanup

The UI is intentionally capable of mock fallback, but important demo-only values should not be presented as live telemetry when live mode is enabled.

- [ ] Replace hard-coded Admin chart datasets with live dashboard API values.
- [ ] Replace hard-coded Admin user governance data with backend user data where supported.
- [ ] Replace hard-coded Faculty KPI values with backend-derived values where supported.
- [ ] Replace hard-coded Student mentor/KPI presentation values with backend-derived values where supported.
- [ ] Ensure all live-mode success messages reflect actual backend persistence.

## 6. Testing Completion

- [ ] Run complete Maven build/test suite in a clean environment.
- [ ] Add/execute missing controller/API tests where practical.
- [ ] Execute integration tests for issue → AI → routing.
- [ ] Execute project/team/task/milestone integration tests.
- [ ] Execute Industry/CSR integration tests.
- [ ] Execute dashboard/notification integration tests.

## Completion Rule

Do **not** mark the project 100% complete merely because code exists. Mark the final prototype complete only after the deployed end-to-end workflow passes with live configuration and the remaining demo-only values are either connected to backend data or explicitly labeled as demo data.
