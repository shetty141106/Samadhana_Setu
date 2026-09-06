# SAMADHANSETU — FRONTEND LAYER CONTEXT (IMPLEMENTATION + CONTINUATION SOURCE OF TRUTH)

> Authoritative frontend build context for continuing SamadhanSetu. Reconciled against the frontend code currently present on `main`, not only the original prototype proposal. Future frontend work must read this file, `readme/PROJECT_CONTEXT.md`, and `readme/samadhansetu_backend_context.md` before changing architecture.

## 1. PROJECT / REPOSITORY

- Project: SamadhanSetu — SIH 2026 PS26043, Government of Jharkhand.
- Repository: `shetty141106/Samadhana_Setu`, branch `main`.
- Frontend root: `frontend/`.
- Runtime: React 18 + Vite 5.
- Styling: Tailwind CSS 3 + custom Jharkhand design tokens.
- Icons: lucide-react.
- Maps: Leaflet + React Leaflet + OpenStreetMap tiles.
- Charts: Recharts.
- State: React Context + local component state.
- Demo data: `frontend/src/data/mockData.js`.
- Client API configuration: `import.meta.env.VITE_API_BASE_URL`.
- AI rule: frontend never calls Gemini/Pinecone/AI service directly; AI remains backend-mediated.

**Current status:** the frontend is a high-fidelity, interactive prototype/demo shell with rich mock-data state. It is not yet equivalent to a fully live backend-integrated application. Preserve the current UI while replacing the data/auth plumbing incrementally.

## 2. CURRENT FRONTEND STRUCTURE

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
    ├── components/
    │   ├── common/       Emblem.jsx, SohraiBorder.jsx
    │   ├── issues/       IssueCard.jsx, IssueDetailModal.jsx, IssueForm.jsx
    │   ├── layout/       AppShell.jsx, Footer.jsx, GovtBanner.jsx, Sidebar.jsx, Topbar.jsx
    │   ├── maps/         IssueMap.jsx, LocationPicker.jsx
    │   ├── notifications/NotificationDropdown.jsx
    │   ├── projects/     KanbanBoard.jsx, ProjectCard.jsx
    │   └── ui/            Badge.jsx, Button.jsx, Card.jsx, Modal.jsx, StatusBadge.jsx, Tabs.jsx
    ├── context/           AuthContext.jsx, DataContext.jsx
    ├── data/              mockData.js
    ├── pages/
    │   ├── landing/       LandingPage.jsx
    │   ├── auth/          Login.jsx
    │   ├── citizen/       CitizenDashboard.jsx
    │   ├── nodal/         NodalDashboard.jsx
    │   ├── faculty/       FacultyDashboard.jsx
    │   ├── student/       StudentDashboard.jsx
    │   ├── industry/      IndustryDashboard.jsx
    │   ├── admin/         AdminDashboard.jsx
    │   └── shared/        ProfilePage.jsx
    └── utils/             constants.js, geoData.js
```

## 3. APP FLOW / ROUTING

`App.jsx` currently uses `currentPath` local state rather than React Router:

```text
App → AuthProvider → DataProvider → MainAppContent
     ├─ landing → LandingPage
     ├─ login → Login
     ├─ profile → ProfilePage
     └─ role-based dashboard → citizen / nodal / faculty / student / industry / admin
```

Navigation values include role dashboards, report issue, issue maps, verification, projects, Kanban, CSR, analytics, governance, and profile views. Do not add React Router solely by convention; introduce it only when deep links/history/protected-route requirements justify it.

## 4. ROLE MODEL — CURRENT IMPLEMENTATION

Six explicit roles exist in `utils/constants.js`:

| Key | Role | Portal |
|---|---|---|
| `citizen` | Citizen | Citizen Portal |
| `nodal` | Nodal Officer | Field Verification Desk |
| `faculty` | Academic Faculty | Faculty R&D Workspace |
| `student` | Student Researcher | Student Innovation Lab |
| `industry` | Industry / CSR Partner | CSR Impact Marketplace |
| `admin` | System Admin | State Command Center |

The original context had three major views, but the implementation expanded University and Industry experiences into explicit Faculty, Student, and Industry roles. This six-role model is now the working frontend contract.

## 5. AUTH — CURRENT VS TARGET

### Current
`AuthContext.jsx` provides `currentRole`, `currentUser`, `roleConfig`, role switching, language toggle (`en`/`hi`), and notification read/unread state. Users come from `MOCK_USERS`. `Login.jsx` includes six one-click persona launchers plus a credentials-looking form; these are demo behavior, not production authentication.

### Target
Replace authentication plumbing with the exact Spring Boot auth routes and JWT contract while preserving the UI:
- real login/register if supported by backend;
- persist/restore authenticated session appropriately;
- derive role and user identity from backend;
- bearer token on authenticated calls;
- centralized 401/403 handling;
- retain one-click role launcher only as explicitly labeled demo mode if desired.

Never put Gemini, Pinecone, DB credentials, JWT signing secrets, or other private server secrets in frontend-exposed variables.

## 6. DATA STATE — CURRENT

`DataContext.jsx` currently owns local mutable demo state:

- `issues`, `projects`, `sponsors`, `stats`
- `addIssue`, `upvoteIssue`, `verifyIssue`
- `updateTaskStatus`, `addKanbanTask`, `sponsorProject`, `updateMilestone`

Target architecture:

```text
Spring Boot REST API → frontend API/service boundary + DTO adapters → DataContext/hooks → existing pages/components
```

Do not rewrite the presentation layer merely to connect APIs. Keep mock fallback until live integration is stable.

## 7. CITIZEN EXPERIENCE — CURRENT

`CitizenDashboard.jsx` includes welcome/action banner, KPI cards, active grievance cards with category filters, district mini-map/full GIS map, issue detail modal, escalation protocol, and navigation to new issue submission.

`IssueForm.jsx` includes title, category/domain, Jharkhand district, landmark/block/village, urgency, exact map location, detailed description, evidence preview/sample photos, and submission state.

### Exact location is a confirmed current requirement
Recent frontend commits `70fbbde...` and `d216d1a...` introduced an interactive Leaflet location picker and changed issue creation from approximate district coordinates to `selectedCoordinates`. Submission is blocked until an exact location is selected. `LocationPicker.jsx` supports map click and district-center fallback and displays exact latitude/longitude. Preserve this behavior.

## 8. NODAL EXPERIENCE — CURRENT

`NodalDashboard.jsx` includes district verification header, verification/critical/routed/resolved KPI cards, pending vs active/in-R&D tabs, case table with ID/date/title/location/category/priority/status, verification action affordance, district GIS map, and issue verification/detail modal.

Current mutations are local via `DataContext.verifyIssue()`. Future live actions should use exact current backend controller contracts, not assumed paths.

## 9. FACULTY EXPERIENCE — CURRENT

`FacultyDashboard.jsx` includes academic mentor identity, mentored-project/student/CSR/patent KPI cards, project selector, project overview, milestone validation/tranche-clearance UI, approval feedback, and Kanban workspace. Milestone actions currently mutate local state.

## 10. STUDENT EXPERIENCE — CURRENT

`StudentDashboard.jsx` includes innovation lab header, sprint-task KPIs, active research initiative, institution/CSR/grant information, team roster, and interactive Kanban.

`KanbanBoard.jsx` has four lanes:

```text
To Do / Backlog
In Lab / Prototyping
Faculty & Lab Review
Verified & Deployed
```

It supports adding tasks, assigning a name, moving tasks forward/backward, and recalculating project progress from completed tasks. Keep the four-lane UI and map it to backend `TaskStatus`: `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`.

## 11. INDUSTRY / CSR EXPERIENCE — CURRENT

`IndustryDashboard.jsx` includes corporate CSR header/budget panel, active pledge and ecological-impact KPIs, vetted R&D marketplace, domain filters, sponsorship modal, pledge amount input, and success state. Current sponsorship uses local `sponsorProject()`.

The UI exists and should be preserved. Real money movement remains a backend/security concern and is not implied by this demo UI.

## 12. ADMIN EXPERIENCE — CURRENT

`AdminDashboard.jsx` includes State Command Center header, statewide KPI cards, Executive Analytics & Charts, State GIS Heatmap, User & Role Governance, Recharts bar chart, Recharts donut/pie lifecycle chart, Leaflet GIS map, and persona/RBAC table.

Some chart values are currently hard-coded demo presentation values. Live backend aggregation must replace them when the `DashboardController` DTO contract is confirmed.

## 13. PUBLIC LANDING + AUTH + PROFILE

`LandingPage.jsx` is the public brand anchor: Jharkhand forest hero photography, “Report. Resolve. Rebuild Jharkhand.”, Report Issue / Explore Projects CTAs, Citizen/University/Industry persona cards, Sohrai-inspired treatment, four-stage How It Works, and impact statistics.

`Login.jsx` provides six-role demo launching and credentials-looking sign-in surface.

`ProfilePage.jsx` displays avatar, role access, name/title, email, phone, district, institution/department, and sign-out affordance.

## 14. SHARED SHELL

`AppShell.jsx` renders GovtBanner, Topbar, authenticated Sidebar + main workspace or full-width public content, and Footer. `Sidebar.jsx` is role-aware and contains navigation for all six roles plus public landing return. Reuse this shell instead of duplicating layout code.

## 15. SHARED COMPONENTS

Existing reusable primitives: `Button`, `Badge`, `StatusBadge`, `Card`/`StatCard`, `Modal`, `Tabs`.

Existing domain components: `IssueCard`, `IssueDetailModal`, `IssueForm`, `IssueMap`, `LocationPicker`, `ProjectCard`, `KanbanBoard`, `NotificationDropdown`, `Emblem`, `SohraiBorder`.

Future screens should reuse these before creating duplicates.

## 16. VISUAL DESIGN SYSTEM — CURRENT SOURCE OF TRUTH

The visual language is **Jharkhand civic/institutional**, not generic SaaS.

Core Tailwind palette:

```text
jh-green:       #f0f8f4 → #051f17; primary #0B3D2E; lush forest #1B5E3B
jh-terracotta:  #fdf4ee → #7e3415; primary #C45C26; saffron #E07A3D
jh-earth:       #FDFBF7 → #28221C; warm cream #F8F5EE
jh-gold:        #F2C94C / #D4AF37 / #B89324
jh-charcoal:    #1C2826
jh-indigo:      #2D4059
```

Fonts: Plus Jakarta Sans/Inter/system-ui for sans; Cormorant Garamond/Merriweather/serif for serif; Plus Jakarta Sans/Poppins for headings.

Existing visual tokens include `jh-soft`, `jh-card`, `jh-glow`, forest/terracotta/green gradients, glass treatments, Sohrai patterns, live indicators, Leaflet styling, and custom scrollbars.

Design principles: civic trust over trendy startup styling; clarity over density; strong role identity; visible status; obvious primary actions; respectful, subtle Jharkhand cultural motifs.

## 17. MAP / LOCATION SOURCE OF TRUTH

Current map stack is **Leaflet + React Leaflet + OpenStreetMap**, not Google Maps.

`geoData.js` defines Jharkhand center/default zoom and coordinates for all 24 districts. `IssueMap.jsx` is the reusable visualization map; `LocationPicker.jsx` is the exact issue-location selector.

Do not switch back to Google Maps without a specific reason. Google Maps variables may remain in `.env.example` from the earlier design but are not the current primary map dependency.

## 18. ENVIRONMENT VARIABLES

Current `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Rules: use `VITE_*`; `VITE_API_BASE_URL` is the main live integration variable; Leaflet means Google Maps key is not currently required; Cloudinary variables are available for media integration; never expose private server/AI secrets through `VITE_*`.

## 19. BACKEND INTEGRATION TARGET

Backend context is authoritative for exact controllers/entities/enums. Relevant controllers include `AuthController`, `IssueController`, `AiIntegrationController`, `UniversityController`, `ProjectController`, `IndustryController`, `DashboardController`, and `NotificationController`.

Target architecture:

```text
Pages / Components → API service + DTO adapters → Spring Boot REST API → MySQL/TiDB + backend-mediated AI service
```

Never access DB or AI service directly from browser code.

## 20. API SERVICE LAYER — NEXT STEP

There is currently no verified dedicated `src/api/` directory in the frontend tree. Add one when beginning live integration:

```text
frontend/src/api/
├── client.js
├── auth.api.js
├── issue.api.js
├── university.api.js
├── project.api.js
├── industry.api.js
├── dashboard.api.js
└── notification.api.js
```

`client.js` should own base URL, bearer token, common headers, and centralized auth/error handling. Controller-specific files should contain request methods. Add DTO adapters/normalizers at the API boundary.

**Important:** confirm exact paths and DTO fields from current Spring Boot controllers before wiring. Do not treat old assumed paths as facts.

## 21. DTO / UI ADAPTER RULE

Use a boundary such as:

```text
Backend Issue DTO → mapIssueToUiModel() → IssueCard / IssueDetailModal / IssueMap
```

Preserve UI semantics for issue ID, title/description, district/exact coordinates, category/domain, priority, lifecycle status, university/project assignment, evidence/media, and timeline/status history.

## 22. ISSUE STATUS NORMALIZATION

Backend `IssueStatus`:

```text
REPORTED, VERIFIED, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED
```

Current frontend demo statuses:

```text
SUBMITTED, VERIFIED, IN_RD, CSR_FUNDED, RESOLVED, REJECTED
```

Normalize at the API boundary:

```text
REPORTED → SUBMITTED
VERIFIED → VERIFIED
ASSIGNED → IN_RD
IN_PROGRESS → IN_RD
RESOLVED → RESOLVED
REJECTED → REJECTED
```

Do not force `CSR_FUNDED` into the backend issue enum unless backend explicitly supports it; treat CSR funding as project/sponsorship state.

## 23. TASK / PROJECT STATUS NORMALIZATION

Backend `TaskStatus`: `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`.

Frontend: `todo`, `in_progress`, `review`, `done`. This is a direct mapping.

Backend `ProjectStatus`: `PLANNED`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `CANCELLED`. Normalize to current presentation labels at the API boundary.

## 24. NOTIFICATIONS

`NotificationDropdown.jsx` exists. Current notifications are mock data managed by `AuthContext`.

Target live integration: backend `NotificationController` / `NotificationService` / `Notification` entity. Prototype remains in-app notifications; external SMS/WhatsApp/email delivery is not implied by the frontend.

## 25. MEDIA / EVIDENCE

Current evidence UI supports image previews and sample field photos. Cloudinary variables exist.

Target flow:

```text
Browser evidence selection → Cloudinary or backend-approved upload → media URL/metadata → Spring Boot Issue API
```

AI analysis remains server-side/backend-mediated. Never expose private AI credentials in browser code.

## 26. ACCESSIBILITY / RESPONSIVENESS

Maintain responsive Tailwind behavior and mobile sidebar. Future changes must preserve keyboard accessibility, visible focus states, sufficient contrast, meaningful alt text, mobile/tablet/desktop layouts, no accidental horizontal overflow, touch-friendly citizen controls, and clear labels/errors.

## 27. DEMO WALKTHROUGH CONTRACT

```text
Landing → Citizen → Report issue → exact map location → Submit → Nodal verification → University / Faculty / Student R&D → Kanban + milestones → Industry / CSR marketplace → Admin GIS + analytics
```

Keep this story coherent during backend integration.

## 28. FRONTEND IMPLEMENTATION STATUS

### Implemented
- React/Vite scaffold
- Tailwind/Jharkhand visual system
- public landing page
- government banner/topbar/sidebar/footer
- six role personas
- demo login/role launcher
- citizen dashboard and issue submission
- issue cards/detail modal
- exact location picker
- Leaflet issue maps
- nodal verification workspace
- faculty R&D workspace
- student innovation workspace
- four-lane Kanban
- industry CSR marketplace demo
- admin analytics/GIS dashboard
- Recharts analytics
- profile page
- notification UI
- mock state/data
- 24-district geodata

### Next required
1. inspect exact current Spring Boot controllers/DTOs;
2. add API client/service boundary;
3. replace demo login with live JWT while retaining demo fallback;
4. connect issue creation/list/detail and AI-enriched response;
5. connect nodal verification/routing;
6. connect project/team/milestone/task operations;
7. connect Industry/CSR endpoints where backend supports them;
8. connect dashboard aggregation/map data;
9. connect notifications;
10. add consistent loading/empty/error states;
11. build and verify with `npm run build`.

## 29. DO NOT REGRESS

- exact map location capture;
- Leaflet/OpenStreetMap implementation;
- six-role model;
- existing Jharkhand/Sohrai visual identity;
- responsive shared shell;
- four-stage Kanban;
- reusable component system;
- backend-mediated AI architecture;
- secret separation;
- demo fallback during live integration.

## 30. FUTURE / DEFERRED UNLESS REQUESTED

- native React Native/Flutter app;
- full Next.js migration;
- offline-first PWA synchronization;
- Aadhaar OTP/DigiLocker;
- voice-first reporting;
- full multilingual localization beyond current language-demo capability;
- client-side OCR/EXIF verification;
- direct browser-to-AI calls;
- production payment settlement infrastructure;
- large-scale social/forum features.

## 31. CONTINUATION RULES FOR FUTURE AGENTS

1. Read `readme/PROJECT_CONTEXT.md` for product/problem authority.
2. Read `readme/samadhansetu_backend_context.md` for backend authority.
3. Read this file for frontend authority.
4. Inspect actual code before proposing replacement architecture.
5. Extend existing components/tokens before creating duplicates.
6. Isolate API/backend concerns from presentation code.
7. Use `import.meta.env.VITE_*` for client configuration.
8. Never put private AI/database/server secrets in frontend.
9. Confirm backend paths/DTOs from current code before API wiring.
10. Preserve demo fallback until live integration is stable.
11. Preserve Leaflet rather than silently returning to Google Maps.
12. Preserve all six roles unless product scope is deliberately changed.
13. Treat hard-coded dashboard numbers as demo data until replaced by live analytics.
14. Run `npm run build` after substantive changes.

## 32. VERIFIED RECENT FRONTEND COMMITS

```text
31b92ee  feat: add Samadhan Setu frontend
70fbbde  feat(frontend): add interactive civic issue location picker
d216d1a  feat(frontend): integrate exact map location into issue reporting
```

## 33. FINAL SOURCE-OF-TRUTH STATEMENT

**From this point onward, this file is the frontend implementation-layer source of truth.** The frontend is an existing React/Vite/Tailwind product shell with six role-based experiences, reusable UI components, local demo state, Leaflet GIS, exact location capture, Kanban workflow, CSR UX, and admin analytics.

Future work follows:

```text
Read context → inspect current frontend → inspect current backend controllers/DTOs → build API boundary + adapters → connect existing UI → preserve demo fallback → build + verify
```

Do not rebuild the frontend from scratch unless explicitly requested.
