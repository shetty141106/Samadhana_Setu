# SamadhanSetu Frontend Integration — Phase Status

Updated: 2026-09-06

## Completed

| Phase | Scope | Status |
|---|---|---|
| 1 | Backend controller, DTO, security and CORS audit | COMPLETE |
| 2 | Frontend API client/service layer | COMPLETE |
| 3 | JWT authentication plumbing | COMPLETE |
| 4 | Citizen issue API integration | COMPLETE |
| 5 | Backend-mediated AI processing | COMPLETE |
| 6 | Nodal verification API integration | COMPLETE |
| 7 | University + Faculty project data integration | COMPLETE |
| 8 | Student + Kanban persistence | COMPLETE |
| 9 | Milestone persistence | COMPLETE |
| 10 | Industry / CSR sponsorship integration | COMPLETE |
| 11 | Admin dashboard analytics API foundation | COMPLETE |
| 12 | Notifications + profile/session integration | COMPLETE |
| 13 | Loading / error / empty-state foundation | COMPLETE |
| 14 | Production API / CORS / environment configuration | COMPLETE |
| 15 | End-to-end build verification workflow | COMPLETE (workflow added; hosted run must be observed after push) |

## Phase 8 — Student + Kanban
- Live projects are hydrated with backend team members, milestones and tasks.
- Kanban task creation calls the backend in live mode.
- Moving a task between lanes persists `TODO`, `IN_PROGRESS`, `REVIEW`, and `DONE` through the task API.
- UI fallback remains available when live mode is disabled.

## Phase 9 — Milestones
- Added `PUT /api/projects/milestones/{milestoneId}` to the Spring Boot project controller/service.
- Faculty milestone status changes now persist in live mode.
- Frontend converts backend milestone enum values to the existing lowercase UI values.

## Phase 10 — Industry / CSR
- Industry organization discovery uses the backend organization endpoints.
- CSR pledges use `POST /api/industry/sponsorships` in live mode.
- Sponsorship records are loaded into the Industry workspace.
- Missing verified organization data produces a clear error instead of a fabricated organization ID.

## Phase 11 — Admin analytics foundation
- Dashboard service adapters exist for summary, issue status/priority/category, project/task status, university participation, location analytics and financials.
- Admin/Nodal live sessions attempt to load the dashboard summary while retaining existing presentation data as fallback.

## Phase 12 — Notifications / session
- Authenticated users load notifications from the backend notification API.
- Mark-read and mark-all-read persist to the backend in live mode.
- Session logout clears JWT/session state.
- Mock notifications remain the fallback when live mode is disabled.

## Phase 13 — UX resilience
- Global live-data loading indicator added to the application shell.
- Global live-data error notice added without replacing the existing workspace.
- Existing screen-level success/error handling remains intact.
- Empty-state handling added to the CSR marketplace.

## Phase 14 — Production configuration

Frontend uses Vite environment variables:

```env
VITE_API_BASE_URL=<deployed-Spring-Boot-API>
VITE_ENABLE_LIVE_API=true
```

Do not put private Gemini/service-account credentials in `VITE_*` variables. AI remains backend-mediated.

The repository now includes a frontend GitHub Actions build workflow using Node 20, `npm ci`, and `npm run build` for pushes/PRs affecting `frontend/**`.

## Phase 15 — Verification
- Added `.github/workflows/frontend-build.yml`.
- The workflow is the repeatable production build gate for the frontend.
- The current GitHub connector does not expose a successful hosted run yet, so the build result must be confirmed from the Actions tab after GitHub starts the workflow.
- A local build could not be executed in this session because the runtime could not resolve GitHub's network host.

## Final integration contract

```text
Landing
  → JWT / demo login
  → Citizen issue + exact GPS
  → Spring Boot issue API
  → Spring Boot AI bridge
  → Nodal verification
  → University routing
  → Faculty / Student project workspace
  → persistent Kanban + milestones
  → Industry CSR sponsorship
  → Admin analytics/GIS
  → notifications/profile/session
```

## Non-regression rules
- Preserve exact map location capture.
- Preserve Leaflet/OpenStreetMap.
- Preserve all six roles.
- Preserve Jharkhand/Sohrai visual identity.
- Preserve the four-stage Kanban.
- Keep AI secrets server-side.
- Keep mock/demo fallback available.
- Do not claim the production deployment is healthy until the deployed frontend/backend URLs and CORS are manually verified.
