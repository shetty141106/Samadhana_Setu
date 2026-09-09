# SAMADHANSETU — FRONTEND LAYER CONTEXT

> **Frontend implementation source of truth.** Reconciled against the current repository implementation on `main`. `readme/PROJECT_CONTEXT.md` remains the product/problem source of truth and is intentionally not modified by this documentation update.

## 1. Project / Stack

- Project: SamadhanSetu — SIH 2026 PS26043, Government of Jharkhand
- Repository: `shetty141106/Samadhana_Setu`
- Frontend root: `frontend/`
- React 18 + Vite 5
- Tailwind CSS 3 + custom Jharkhand design tokens
- Leaflet + React Leaflet + OpenStreetMap
- Recharts
- React Context + local component state
- API layer: `frontend/src/api/`
- Production API base: `VITE_API_BASE_URL`
- Live-data switch: `VITE_ENABLE_LIVE_API=true`
- Optional demo/mock data remains in `frontend/src/data/mockData.js`
- Browser never calls Gemini or the Python AI service directly; AI is backend-mediated.

## 2. Current Status

The frontend is substantially implemented and connected to the Spring Boot API at code level. It is **not yet fully runtime-verified** against the deployed services.

Implemented integrations include:

- JWT authentication and session handling
- citizen registration/login flow
- citizen issue creation/listing
- backend-mediated AI result display
- nodal verification/status/priority operations
- projects, teams, tasks and Kanban persistence
- milestone persistence
- Industry/CSR organization and sponsorship flows
- dashboard/analytics API integration where supported
- notifications/session handling
- authenticated role-aware hash routing
- centralized 401 session invalidation
- Admin user/role governance UI
- Admin All Issues page backed by `/api/issues`

Important known API-contract gaps remain in the issue flow and must be fixed before claiming the citizen → issue → admin workflow is fully correct:

1. `IssueForm.jsx` currently sends priority values such as `High`, while the backend enum expects `HIGH`, `MEDIUM`, `LOW`, `CRITICAL`.
2. The frontend sends `category` and `district`, but the current `IssueRequestDto` does not contain those fields.
3. The backend `Issue` entity has `category`, but district is not currently modeled on the entity.
4. `IssueResponseDto` currently does not expose category, district, or citizen name/email, so the Admin All Issues page cannot receive those values from the backend yet.
5. Cloudinary evidence upload requires the production frontend variables to be configured separately.

## 3. Frontend Structure

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── styles.css
    ├── api/
    ├── components/
    │   ├── common/
    │   ├── issues/
    │   ├── layout/
    │   ├── maps/
    │   ├── notifications/
    │   ├── projects/
    │   └── ui/
    ├── context/
    ├── data/
    ├── pages/
    │   ├── landing/
    │   ├── auth/
    │   ├── citizen/
    │   ├── nodal/
    │   ├── faculty/
    │   ├── student/
    │   ├── industry/
    │   ├── admin/
    │   └── shared/
    └── utils/
```

## 4. Six-Role Contract

| Role | Portal |
|---|---|
| Citizen | Citizen Portal |
| Nodal Officer | Field Verification Desk |
| Faculty | Faculty R&D Workspace |
| Student | Student Innovation Lab |
| Industry | CSR Impact Marketplace |
| Admin | State Command Center |

The frontend preserves all six roles. Live role identity comes from the backend JWT/session; the UI does not impersonate another role.

## 5. Authentication & Role Routing

`auth.api.js` calls `/api/auth/login` and `/api/auth/register`. The API client stores the returned JWT and attaches it as a bearer token to subsequent requests. A 401 clears the token and dispatches the shared auth-invalidated event.

Rules:

- the backend JWT is authoritative;
- login persona cards are role selectors, not role-switching controls;
- if selected role and server-returned role do not match, the UI must not open the wrong dashboard;
- authenticated hash routes are constrained by the authenticated role;
- logout clears JWT and persisted session state;
- citizen self-registration creates a citizen account; privileged roles must be provisioned by an authorized admin/backend mechanism;
- never expose JWT signing secrets, Gemini credentials, database credentials or service-account credentials through `VITE_*` variables.

## 6. API / DTO Boundary

```text
Pages / Components
       ↓
frontend/src/api/*
       ↓
Spring Boot REST API
       ↓
TiDB/MySQL + backend AI service
```

`client.js` owns base URL, bearer token, common request behavior and auth/error handling.

### Current issue contract warning

The frontend issue form currently builds a richer UI payload than the backend DTO accepts. The following values are collected in the UI:

```text
category
categoryLabel
district
locationName
latitude
longitude
priority
evidenceMedia
```

The current backend request DTO accepts only:

```text
title
description
location
latitude
longitude
priority
evidenceMedia
```

Therefore category/district persistence is not currently guaranteed, and priority must be normalized to backend enum values before submission.

## 7. DataContext / Live Mode

`DataContext.jsx` enables live hydration only when:

```env
VITE_ENABLE_LIVE_API=true
```

For live authenticated users:

- Citizen → own issues
- Admin/Nodal Officer → operational issue list
- other roles → no unrestricted issue list
- projects are hydrated through project, milestone, task and team APIs
- dashboard and sponsorship data are attempted where authorized

Live mutations include issue creation, issue status/priority updates, task creation/status updates, milestone updates and CSR sponsorship creation.

Issue upvotes currently use user-scoped browser `localStorage`; they are not persistent server-side votes. This is presentation-level protection only.

## 8. Citizen Experience

Implemented:

- dashboard KPIs
- issue cards/detail modal
- category filtering
- exact map location capture
- Leaflet map
- evidence/image preview
- issue submission API
- citizen issue listing
- AI-enriched issue response presentation
- status/timeline presentation

### Known submission blocker

The form currently sends human-readable priority values (`Critical`, `High`, `Medium`, `Low`) while Spring's `IssuePriority` enum expects uppercase enum names. Unless the request is normalized, issue submission can fail with a request-deserialization error.

### Known persistence gap

The UI collects category and district, but the current backend request/entity/response contract does not persist/expose district and does not accept category in `IssueRequestDto`. These fields must be aligned before treating them as database-backed features.

### Evidence

Evidence upload is optional in the form, but selected files are uploaded before issue creation. The upload path requires valid Cloudinary frontend configuration when files are attached.

## 9. Nodal Experience

Implemented:

- verification queue
- priority counts
- GIS view
- issue detail/verification modal
- status update API
- priority update API
- university assignment presentation
- nodal remarks presentation

Backend authorization remains authoritative.

## 10. Faculty Experience

Implemented:

- project selector
- project details
- milestone validation UI
- persistent milestone status updates
- Kanban review workspace

Some presentation KPIs remain demo-oriented where the backend does not provide the exact aggregate required.

## 11. Student Experience

Implemented:

- assigned project view
- team roster
- task KPIs
- four-lane Kanban
- task creation
- task status persistence
- project progress presentation

Backend task statuses:

```text
TODO, IN_PROGRESS, REVIEW, DONE
```

Frontend presentation statuses:

```text
todo, in_progress, review, done
```

## 12. Industry / CSR Experience

Implemented:

- organization discovery from backend
- R&D marketplace
- project filtering
- sponsorship amount form
- sponsorship API
- sponsorship records in live mode
- verified-organization validation

The UI records sponsorship intent/records. It does not represent real payment settlement.

## 13. Admin Experience

Implemented:

- state command center
- dashboard summary/analytics integration foundation
- GIS issue map
- user & role governance UI
- admin-only user creation API integration
- dedicated **All Issues** page
- issue search/filter/detail presentation

### All Issues data contract status

The page calls the live operational issue API for Admin/Nodal users. However, the current backend `IssueResponseDto` returns only ID, title, description, location, coordinates, status, priority, citizen ID, evidence and AI analysis. It does not yet return district, category or citizen name/email. The page should therefore be considered **partially live until the backend DTO is aligned**.

### Role governance

The admin UI supports creation of privileged accounts. The backend `/api/users/**` endpoint is protected by `ADMIN` role. Current backend role set includes `NODAL_OFFICER`, `FACULTY`, `STUDENT`, `INDUSTRY`, and `ADMIN`; if product scope is tightened to only the four explicitly requested privileged roles, remove `STUDENT` from both UI and backend allowed-role lists.

## 14. Notifications / Session

Implemented:

- notification API integration
- unread/read state
- mark read/delete
- session logout/JWT cleanup
- centralized auth invalidation on 401
- mock notifications when live mode is disabled

External SMS/WhatsApp/email delivery is outside current frontend scope.

## 15. Maps / Location

Primary map stack:

**Leaflet + React Leaflet + OpenStreetMap.**

`LocationPicker.jsx` captures exact latitude/longitude. Preserve this behavior.

Legacy Google Maps variables may exist in configuration, but the current implementation does not require Google Maps for the primary issue map/location flow.

## 16. Environment

Production frontend configuration currently follows:

```env
VITE_API_BASE_URL=https://samadhana-setu.onrender.com
VITE_ENABLE_LIVE_API=true
VITE_CLOUDINARY_CLOUD_NAME=<required when uploading evidence>
VITE_CLOUDINARY_UPLOAD_PRESET=<required when uploading evidence>
```

Cloudinary is the only currently known external frontend configuration gap for evidence uploads. Never commit secrets.

## 17. CI / Build

A frontend GitHub Actions workflow exists at `.github/workflows/frontend-build.yml`. The workflow must match the actual dependency-lock situation in `frontend/`; if `frontend/package-lock.json` is absent, `npm ci` and npm cache configuration pointing to that file will fail. The current repository should use an install command consistent with the committed package metadata.

Hosted CI success and Vercel runtime health are separate verification gates.

## 18. Demo Walkthrough Contract

```text
Landing
 → Citizen registration/login
 → Report issue + exact GPS + optional evidence
 → Spring Boot issue API
 → backend AI processing
 → Nodal verification
 → university routing
 → Faculty/Student R&D
 → Kanban + milestones
 → Industry CSR sponsorship
 → Admin GIS + analytics + All Issues
 → notifications/profile/session
```

The issue contract must be corrected before this walkthrough is considered fully verified.

## 19. Remaining Frontend Work

1. Align issue priority/category/district payload with backend DTO/entity/response contracts.
2. Verify citizen issue creation against the deployed backend.
3. Add/verify live category and district fields in Admin All Issues after backend alignment.
4. Verify six-role hosted login and protected routes.
5. Verify production CORS/JWT behavior.
6. Verify live AI results through issue creation.
7. Replace important hard-coded Faculty/Student presentation values where live aggregates are available.
8. Verify Cloudinary evidence upload configuration if evidence is used in the final demo.
9. Fix/verify the frontend CI install strategy against the actual lockfile state.
10. Execute the complete deployed SIH walkthrough.

## 20. Non-Regression Rules

- Preserve exact GPS capture.
- Preserve Leaflet/OpenStreetMap.
- Preserve all six roles unless product scope deliberately changes.
- Preserve server-authoritative role assignment.
- Preserve Jharkhand/Sohrai identity.
- Preserve four-stage Kanban.
- Keep AI server-side/backend-mediated.
- Keep mock fallback available for presentation resilience.
- Do not claim hosted health or full live integration without runtime verification.

## 21. Source-of-Truth Rule

**This file describes the frontend that actually exists in the repository, including known contract gaps.** Future work must inspect the current frontend code and current backend controllers/DTOs before changing architecture. Do not rebuild the frontend from scratch.
