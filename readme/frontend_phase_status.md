# SamadhanSetu Frontend Integration — Phase Status

Updated: 2026-09-06

## Completed

| Phase | Scope | Status |
|---|---|---|
| 1 | Backend controller, DTO, security and CORS audit | COMPLETE |
| 2 | Frontend API client/service layer | COMPLETE |
| 3 | JWT authentication plumbing | COMPLETE |
| 4 | Citizen issue API integration | COMPLETE |
| 5 | Backend-mediated AI processing after issue creation | COMPLETE |
| 6 | Nodal verification API integration | COMPLETE |
| 7 | University + Faculty project data integration | COMPLETE |

## Phase 3
- Login form calls `POST /api/auth/login` in live mode.
- JWT is persisted in local storage and attached by the shared API client.
- Backend role values are normalized to the frontend six-role model.
- Demo persona launcher remains available when live mode is disabled.
- Logout clears the token/session.

## Phase 4
- Citizen issue creation uses the real issue API in live mode.
- Exact latitude/longitude and location are sent to the backend.
- Backend priority enum values are normalized from UI labels.
- Citizen issue lists load from the authenticated citizen endpoint.
- Mock fallback remains available.

## Phase 5
- After successful live issue creation, the frontend invokes the Spring Boot AI endpoint for that issue.
- AI output is displayed as a triage summary without exposing AI credentials to the browser.
- Duplicate detection and confidence are surfaced when returned by the backend.

## Phase 6
- Nodal users receive the live issue queue through `DataContext`.
- Verification status and priority changes use the real issue status/priority endpoints.
- Existing nodal verification UI and university assignment presentation are preserved.

## Phase 7
- Live universities are loaded from `/api/universities`.
- University routing is available through `/api/universities/routing?category=...`.
- Faculty/student project views can consume live projects.
- Projects are hydrated with their backend milestones and tasks for the existing frontend workspace.
- Existing UI remains the presentation layer; backend DTO differences are handled in API services.

## Live mode

Set:

```env
VITE_ENABLE_LIVE_API=true
VITE_API_BASE_URL=<Spring-Boot-API-base-url>
```

Keep `VITE_ENABLE_LIVE_API=false` for the standalone mock/demo experience.

## Next

Phase 8 — Student + Kanban persistence.
