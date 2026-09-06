# SAMADHANSETU — FRONTEND LAYER CONTEXT

> **Frontend implementation source of truth.** Reconciled against the frontend code currently present on `main` as of 2026-09-06. Future frontend work must read this file, `readme/PROJECT_CONTEXT.md`, and `readme/samadhansetu_backend_context.md` before changing architecture.

## 1. Project / Stack

- Project: SamadhanSetu — SIH 2026 PS26043, Government of Jharkhand
- Repository: `shetty141106/Samadhana_Setu`
- Frontend root: `frontend/`
- React 18 + Vite 5
- Tailwind CSS 3 + custom Jharkhand design tokens
- lucide-react
- Leaflet + React Leaflet + OpenStreetMap
- Recharts
- React Context + local component state
- API layer: `frontend/src/api/`
- Client configuration: `VITE_API_BASE_URL`
- Live-data switch: `VITE_ENABLE_LIVE_API=true`
- Demo fallback: `frontend/src/data/mockData.js`
- AI rule: browser never calls Gemini or the Python AI service directly; AI remains backend-mediated.

## 2. Current Status

The frontend is **implemented and integrated at code level** with the Spring Boot backend. It is no longer only a mock-data shell.

Implemented live integrations include:

- authentication/JWT
- citizen issues
- backend-mediated AI result flow
- nodal verification/status/priority updates
- projects, teams, tasks and Kanban persistence
- milestone persistence
- Industry/CSR organizations and sponsorships
- dashboard summary foundation
- notifications/session handling
- environment-driven API configuration
- loading/error/empty-state handling

Remaining frontend work is primarily **hosted runtime verification and replacing selected hard-coded presentation/demo values with live backend aggregates where backend data is available**.

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
    │   ├── client.js
    │   ├── auth.api.js
    │   ├── issue.api.js
    │   ├── project.api.js
    │   ├── industry.api.js
    │   ├── dashboard.api.js
    │   └── notification.api.js
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

Preserve all six roles unless product scope is deliberately changed.

## 5. Authentication

`auth.api.js` uses the Spring Boot authentication endpoints and stores the returned JWT through the centralized API client. Registration is also API-backed.

The login screen retains six persona launchers for **explicit demo-mode navigation**. This should not be mistaken for production authentication.

Rules:

- bearer token belongs in the centralized API client;
- handle 401/403 centrally;
- do not expose JWT signing secrets;
- do not expose Gemini/database/server credentials through `VITE_*` variables;
- preserve demo fallback where required for presentation resilience.

## 6. API / DTO Boundary

The frontend now uses a dedicated API boundary:

```text
Pages / Components
       ↓
API services + DTO adapters
       ↓
Spring Boot REST API
       ↓
MySQL/TiDB + backend AI service
```

`client.js` owns base URL, bearer token, common request behavior and auth/error handling.

`issue.api.js` normalizes backend issue statuses and evidence media. Backend status mapping:

```text
REPORTED     → SUBMITTED
VERIFIED     → VERIFIED
ASSIGNED     → IN_RD
IN_PROGRESS  → IN_RD
RESOLVED     → RESOLVED
REJECTED     → REJECTED
```

`CSR_FUNDED` remains a UI/project/sponsorship concept rather than a backend IssueStatus unless backend support is explicitly added.

## 7. DataContext / Live Mode

`DataContext.jsx` now supports live API hydration when:

```env
VITE_ENABLE_LIVE_API=true
```

It loads live issues and projects and attempts dashboard/sponsorship data for authorized roles. Mutation methods use backend APIs in live mode and preserve local fallback otherwise.

Implemented live mutations include:

- issue creation
- issue status update
- issue priority update
- task creation
- task status update
- milestone update
- CSR sponsorship creation

## 8. Citizen Experience

Implemented:

- dashboard KPIs
- issue cards/detail modal
- category filtering
- exact GPS location capture
- Leaflet map
- evidence/image preview
- issue submission API
- citizen issue listing
- AI-enriched issue data through backend response
- issue timeline/status presentation

**Exact location is a non-regression requirement.** Submission must preserve selected latitude/longitude rather than silently reverting to approximate district coordinates.

## 9. Nodal Experience

Implemented:

- verification queue
- critical priority count
- GIS view
- issue detail/verification modal
- status update API
- priority update API
- university assignment presentation
- nodal remarks presentation

Backend authorization remains authoritative; UI controls do not replace server-side RBAC.

## 10. Faculty Experience

Implemented:

- project selector
- project details
- milestone validation UI
- persistent milestone status updates
- Kanban review workspace

Some KPI/presentation values remain demo-oriented and should be replaced with live aggregates where the backend exposes the required data.

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
- clear error when no verified organization is available

The UI records sponsorship intent/records. It does not imply real payment settlement.

## 13. Admin Experience

Implemented:

- state command center
- dashboard summary integration foundation
- GIS issue map
- analytics charts
- user/RBAC presentation

**Known remaining cleanup:** some chart datasets and user/persona rows are hard-coded demo presentation values. These should not be described as live telemetry. Replace them with backend values when the relevant aggregation endpoints/data are available.

## 14. Notifications / Session

Implemented:

- notification API integration
- unread/read state
- mark read/all read
- session logout/JWT cleanup
- fallback mock notifications when live mode is disabled

External SMS/WhatsApp/email delivery is outside the current frontend prototype scope.

## 15. Maps / Location

Primary map stack:

**Leaflet + React Leaflet + OpenStreetMap.**

`geoData.js` contains Jharkhand's 24-district data. `IssueMap.jsx` visualizes issues and `LocationPicker.jsx` captures exact issue coordinates.

Do not replace Leaflet with Google Maps without an explicit product decision.

## 16. Visual System

Preserve the existing Jharkhand civic/institutional identity:

- forest green
- terracotta
- warm earth/cream
- gold accents
- Sohrai-inspired motifs
- civic/government presentation rather than generic SaaS styling

Preserve responsive layouts, mobile navigation, visible focus states, meaningful alt text and touch-friendly controls.

## 17. Environment

Frontend configuration is environment-driven:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_LIVE_API=true
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

`VITE_GOOGLE_MAPS_API_KEY` may exist in legacy configuration but is **not required by the current Leaflet/OpenStreetMap implementation**.

Never place private Gemini, database, JWT signing, service-account or other server secrets in `VITE_*` variables.

## 18. CI / Build

A frontend GitHub Actions workflow exists at `.github/workflows/frontend-build.yml` using Node 20, `npm ci` and `npm run build`.

The workflow is the repeatable frontend build gate. A successful hosted run still needs to be observed/confirmed after deployment changes.

## 19. Demo Walkthrough Contract

```text
Landing
 → Citizen login/demo
 → Report issue + exact GPS + evidence
 → Spring Boot issue API
 → backend AI processing
 → Nodal verification
 → university routing
 → Faculty/Student R&D
 → Kanban + milestones
 → Industry CSR sponsorship
 → Admin GIS + analytics
 → notifications/profile/session
```

This is the primary SIH demonstration story.

## 20. Remaining Frontend Work

1. Verify the hosted frontend build/run.
2. Verify frontend → deployed backend connectivity.
3. Verify production CORS/JWT behavior.
4. Verify live AI results through the complete user flow.
5. Replace important hard-coded Admin/F​aculty/Student presentation values with live backend aggregates where supported.
6. Confirm Cloudinary evidence upload configuration if used in the final demo.
7. Execute the complete deployed SIH walkthrough.

## 21. Non-Regression Rules

- Preserve exact GPS capture.
- Preserve Leaflet/OpenStreetMap.
- Preserve all six roles.
- Preserve Jharkhand/Sohrai identity.
- Preserve four-stage Kanban.
- Preserve reusable components.
- Keep AI server-side/backend-mediated.
- Keep mock fallback available for demo resilience.
- Do not claim hosted production health until it has been manually verified.

## 22. Source-of-Truth Rule

**This file describes the frontend as it exists now, not the original planned frontend.** Future agents must inspect actual code and current backend controller/DTO contracts before changing architecture. Do not rebuild the frontend from scratch.
