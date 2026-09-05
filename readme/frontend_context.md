# SAMADHANSETU — FRONTEND LAYER CONTEXT (PROTOTYPE SCOPE)

> **Purpose of this file**: This is the frontend implementation-layer ground truth for SamadhanSetu — which screens exist, what tech stack to use, how the frontend talks to the backend, and what's explicitly deferred. Follows **prototype/hackathon MVP scope** (`PROJECT_CONTEXT.md` Section 4), NOT the full production vision (`PROJECT_CONTEXT.md` Section 3.1) — production-scale items (React Native/Flutter mobile app, Aadhaar OTP, DigiLocker, full PWA offline sync, multi-language voice input) are included only as a clearly-marked "Future / Not Now" appendix. Written for AI-agent consumption, not human reading.

---

## 1. METADATA

- `layer_name`: Frontend Layer
- `scope_mode`: PROTOTYPE (hackathon MVP) — web-only, do not build mobile app or offline-first PWA unless explicitly instructed
- `relationship_to_other_context_files`:
  - `PROJECT_CONTEXT.md` → defines *why* each screen/feature exists and the full production vision (Sections 3.1, 4.2, 4.4, 4.5)
  - `samadhansetu_backend_context.md` → defines the Spring Boot REST controllers this frontend calls (`AuthController`, `IssueController`, `UniversityController`, `ProjectController`, `DashboardController`, etc.)
  - `ai_ml_context.md` → defines the AI-derived fields (category tag, dedup flag, matched university) that surface in the citizen submission flow and dashboard, written back via the backend — frontend does NOT call the AI service directly, only the Spring Boot backend
  - This file → defines the actual pages/components, tech stack, state management, and API-call contract for the prototype build
- `app_type`: single responsive web app (no separate mobile app at prototype stage), serving three distinct role-based views (Citizen, University Nodal Officer, Government/Admin Dashboard)

---

## 2. WHERE FRONTEND SITS IN THE OVERALL ARCHITECTURE

```
[Browser: React Web App]  ← THIS FILE covers this box
        │
        │  REST calls (JWT-authenticated after login)
        ▼
[Spring Boot Backend: Controller → Service → Repository → Entity]
        │
        ▼
[MySQL DB]  +  [Python FastAPI AI Service] (indirect, backend-mediated only)
```

- Frontend never calls the AI service directly — it only calls Spring Boot endpoints (e.g. `IssueController`), which internally trigger `AiIntegrationController → AiBridgeService` and return AI-enriched results (category tag, dedup flag, routing) as part of the normal Issue API response.
- Frontend never touches the database directly — all data access is via backend REST endpoints.

---

## 3. THE THREE PROTOTYPE VIEWS (Screens to Build Now)

| # | View | Maps to Backend Module | Maps to PS/MVP Section | Primary Users |
|---|---|---|---|---|
| 1 | Citizen Submission Form | Module 2 — Citizen Ingestion (`IssueController`) | `PROJECT_CONTEXT.md` Section 4.2 | Citizen |
| 2 | University Nodal Workspace | Module 4 — Academic Workspace + Module 5 — R&D/Kanban (`UniversityController`, `ProjectController`) | `PROJECT_CONTEXT.md` Section 4.4 | Faculty / Nodal Officer |
| 3 | Government Analytics Dashboard | Module 7 — Analytics & Heatmaps (`DashboardController`) | `PROJECT_CONTEXT.md` Section 4.5 | Government Admin |

- A fourth minimal screen — **Login/Signup** — is required to support role-based access (Citizen / Faculty / Admin) even though it's not separately named as a "module" in the PS; it maps to `AuthController` in the backend.

---

## 4. VIEW 1 — CITIZEN SUBMISSION FORM

### 4.1 Fields / Components
- Title (text input)
- Description (textarea) — vernacular text allowed as-is, no client-side translation; translation happens backend/AI-side
- Location picker — Google Maps API (or static lat/long input fallback if API key unavailable)
- Image uploader — connects to Cloudinary (per backend context, media upload target)
- Submit button → calls `IssueController` create-issue endpoint

### 4.2 Post-Submission Feedback (AI-enriched, read from backend response)
- Show auto-assigned category tag (from canonical domain list — see Section 8)
- Show duplicate-match flag if present, e.g. "Similar issue detected 2km away (85% match)" (sourced from `ai_ml_context.md` Section 4.2 contract)
- Show routed university (if a rule-based match was found)

### 4.3 Auth for This View
- Simple JWT login (phone/email + password) — **no Aadhaar OTP, no DigiLocker** at prototype stage (explicitly deferred per `PROJECT_CONTEXT.md` Section 4.2).

---

## 5. VIEW 2 — UNIVERSITY NODAL WORKSPACE

### 5.1 Components
- Inbox of "Assigned Challenges" — list of Issues routed to this university (calls `IssueController`/`UniversityController` list endpoint, filtered by university ID)
- "Accept & Assign Team" action — links a dummy/selected Faculty Lead + Student Lead to the issue (calls `ProjectController` / `TeamMember` creation endpoint)
- Simple Kanban board — three columns: **To Do → In Progress → Resolved**, backed by `Task`/`Project` status fields (`TaskStatus` enum: `TODO, IN_PROGRESS, REVIEW, DONE` — per backend context; prototype UI may collapse `REVIEW` into `IN_PROGRESS` visually if simpler for the 3-column MVP board, but the underlying enum in the backend stays as-is)

### 5.2 Auth for This View
- JWT login as Faculty/Nodal Officer role.

---

## 6. VIEW 3 — GOVERNMENT ANALYTICS DASHBOARD

### 6.1 Components
- Interactive map with pins, color-coded by sector/domain — calls `DashboardController` aggregate endpoint for issue locations + categories
- Metric cards: Total Submissions, Active University Projects, Resolved Issues — calls `DashboardController` summary endpoint
- Domain distribution chart — bar/pie chart of issues by category

### 6.2 Auth for This View
- JWT login as Admin role.

---

## 7. PROTOTYPE TECH STACK (Build This Now)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **React** (web only) | Per `PROJECT_CONTEXT.md` Section 4.2 — "simple React web frontend form"; no React Native/Flutter mobile app at this stage |
| Routing | React Router (or equivalent SPA router) | Standard choice for a 3–4 view SPA; not explicitly named in source docs, reasonable default |
| State management | Local component state / React Context | No heavy state library (Redux etc.) named or required for prototype scope — avoid over-engineering |
| Styling | **Tailwind CSS** | Not specified in source docs — this is a design decision made for this project, not doc-sourced. Full design system in Section 13. |
| Maps / location picker | **Google Maps API** | Per `PROJECT_CONTEXT.md` Section 4.2 |
| Image upload | **Cloudinary** | Per `PROJECT_CONTEXT.md` Section 4.2 |
| Charts (dashboard) | **Chart.js** or **Recharts** | Per `PROJECT_CONTEXT.md` Section 4.5 — either acceptable |
| Auth | JWT-based (phone/email + password login), token stored client-side and sent on each API call | Per `PROJECT_CONTEXT.md` Section 4.2; matches backend's `AuthController`/JWT phase (backend context Section 9, Phase 6–7) |
| API communication | REST calls (fetch/axios) to Spring Boot backend | No GraphQL, no direct DB access, no direct AI-service calls |

### 7.1 Explicitly Deferred/Skipped at Prototype Stage
- No React Native / Flutter mobile app — web-only for hackathon demo.
- No offline-first PWA / service-worker sync — requires live connectivity.
- No voice-first input / Speech-to-Text UI — text-only submission form.
- No multilingual UI localization beyond allowing vernacular text entry (Hindi text is accepted as raw input; no UI language switcher required at prototype stage).
- No real-time push notifications (SMS/WhatsApp) — in-app-only notification display if built at all, matching backend Module 8's MVP scope.
- No client-side EXIF/geotag verification or OCR — raw upload only.

---

## 8. CANONICAL DOMAIN CLASSIFICATION LIST (use exactly, for display/filter UI — do not invent new categories)

```
Education, Agriculture, Healthcare, Water Resources, Environment,
Energy, Urban Development, Accessibility, Public Administration, Rural Livelihoods
```

---

## 9. FRONTEND ↔ BACKEND API CONTRACT (prototype expectations)

| Frontend Action | Backend Endpoint (Controller) | Expected Response Fields Consumed |
|---|---|---|
| Login | `AuthController` | JWT token, user role |
| Submit new issue | `IssueController` | `issue_id`, `category_tag`, `duplicate_match` (+ %), `matched_university_id` (AI-enriched, per `ai_ml_context.md` Section 7 contract) |
| View assigned challenges (University view) | `IssueController` / `UniversityController` | List of Issues filtered by university, each with title/description/status/priority |
| Accept & assign team | `ProjectController` | New `Project`/`TeamMember` record confirmation |
| Update Kanban task status | `ProjectController` (Task sub-resource) | Updated `TaskStatus` |
| Load dashboard map/metrics | `DashboardController` | Aggregated counts, geo-tagged issue list, domain distribution |

- Frontend must send the JWT token on every authenticated call (standard `Authorization: Bearer <token>` header pattern) — exact header/middleware detail is a backend implementation concern (see `samadhansetu_backend_context.md` Phase 6–7), not restated here.

---

## 10. REQUIRED ENVIRONMENT VARIABLES / KEYS (frontend-side)

| Key | Purpose | Required? |
|---|---|---|
| `REACT_APP_GOOGLE_MAPS_API_KEY` (or equivalent env var name per chosen build tool) | Location picker on citizen submission form | Yes, unless falling back to static lat/long input |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` (+ upload preset, if using unsigned uploads) | Image upload widget | Yes, per MVP spec |
| Backend API base URL (e.g. `REACT_APP_API_BASE_URL`) | Points frontend at the Spring Boot backend | Yes |

- No AI-service keys (Gemini/Pinecone) are needed on the frontend — those live only in the AI microservice, per `ai_ml_context.md`.

---

## 11. FUTURE / NOT NOW — FULL PRODUCTION FRONTEND VISION (do not build unless explicitly asked)

> Everything below is sourced from `PROJECT_CONTEXT.md` Section 3.1 (full production architecture). Included only for context/roadmap awareness — the prototype must follow Sections 3–10 above, not this section.

- Native mobile app: **React Native or Flutter**, cross-platform.
- Full responsive web app via **Next.js** (SSR/routing upgrade from plain React SPA).
- Optimization for low-bandwidth rural networks.
- Full multilingual UI localization: Hindi, Santhali, Mundari, Ho, English (AI-based localization), not just raw vernacular text acceptance.
- Voice-first input with Speech-to-Text pipeline integration.
- Progressive Web App (PWA) with offline data capture and sync-on-reconnect.
- Aadhaar-based OTP and DigiLocker integration for citizen authentication/trust verification.
- Multi-channel notification consumption in-app (SMS/WhatsApp/email/push triggers surfaced natively in UI, not just in-app banners).

---

## 12. DETAILED TECHNICAL API INTEGRATION

> Expands on Section 9. Everything in this section is a **build-level implementation decision for this project** (not restated PS/backend-doc content) — flagged here as such where it goes beyond what Section 9 states.

### 12.1 HTTP Client Setup
- Use **axios** with a single shared instance (`src/api/client.js`), base URL from `REACT_APP_API_BASE_URL`.
- Attach JWT automatically via an axios request interceptor (reads token from storage, sets `Authorization: Bearer <token>` header) — avoids repeating auth logic per call.
- Attach a response interceptor to catch `401`/`403` globally → clear stored token → redirect to login.

### 12.2 API Module Structure (one file per backend controller, mirrors Section 9's table)
```
src/api/
├── client.js         (axios instance + interceptors)
├── auth.api.js        → AuthController   (login, signup)
├── issue.api.js        → IssueController  (createIssue, getIssuesByUniversity, getIssueById)
├── university.api.js   → UniversityController (getAssignedChallenges)
├── project.api.js      → ProjectController (createProject, addTeamMember, updateTaskStatus)
└── dashboard.api.js    → DashboardController (getMetrics, getMapData, getDomainDistribution)
```

### 12.3 Endpoint-Level Contract (assumed REST conventions — confirm exact paths against actual backend when controllers are implemented)
| Function | Method + Path (assumed) | Request Body | Response Shape |
|---|---|---|---|
| `login(credentials)` | `POST /api/auth/login` | `{ email/phone, password }` | `{ token, role, userId }` |
| `createIssue(data)` | `POST /api/issues` | `{ title, description, latitude, longitude, mediaUrls[] }` | `{ issueId, categoryTag, duplicateMatch: { found, percent, matchedIssueId }, matchedUniversityId }` |
| `getIssuesByUniversity(universityId)` | `GET /api/universities/{id}/issues` | — | `Issue[]` |
| `createProject(issueId, teamData)` | `POST /api/projects` | `{ issueId, universityId, teamMembers[] }` | `{ projectId, status }` |
| `updateTaskStatus(taskId, status)` | `PATCH /api/tasks/{id}` | `{ status }` | `{ taskId, status }` |
| `getMetrics()` | `GET /api/dashboard/metrics` | — | `{ totalSubmissions, activeProjects, resolvedIssues }` |
| `getMapData()` | `GET /api/dashboard/map` | — | `Issue[]` with `latitude, longitude, categoryTag` |
| `getDomainDistribution()` | `GET /api/dashboard/domains` | — | `{ domain: string, count: number }[]` |

- These exact paths are **assumed REST conventions for a prototype build**, not confirmed against actual backend route definitions — treat as a starting contract to align with whoever implements the Spring Boot `@RequestMapping` paths, not as fixed doc-sourced fact.

### 12.4 Loading / Error State Convention
- Every API-calling component tracks three states: `loading`, `data`, `error` (simple `useState` triples, no need for a data-fetching library like React Query at prototype scale — optional upgrade if time allows).
- On `error`, show a minimal inline message; do not block the whole view unless the error is auth-related (401/403 → handled globally per 12.1).

### 12.5 AI-Enriched Response Handling (Citizen Submission Form)
- After `createIssue` resolves, read `categoryTag`, `duplicateMatch`, `matchedUniversityId` directly from the same response (backend returns these synchronously per the AI pipeline's single-pass design — see `ai_ml_context.md` Section 3) — no polling or separate "check AI status" call needed at prototype stage.

---

## 13. UI/UX DESIGN SYSTEM (TAILWIND CSS)

> **Everything in this section is an original design system created for this project — none of it is sourced from PS26043.md, misc.md, or the SamadhanSetu backend PDF.** No UI/UX direction existed in any source document, so this section is explicitly a proposal, not a fact. Treat it as the working design system unless the user overrides it.

### 13.1 Design Principles
- **Civic trust, not corporate SaaS**: the platform is used by rural citizens, faculty, and government officials alike — visuals should read as credible/institutional (govt-adjacent) rather than trendy startup branding.
- **Clarity over density**: citizens may have low digital literacy — generous spacing, large touch targets, minimal jargon, obvious primary actions.
- **Status is always visible**: every issue/project/task view leads with its status (color-coded), since the whole product's value is "tracking a problem to resolution."

### 13.2 Color System (Tailwind config tokens)
```js
// tailwind.config.js — theme.extend.colors
colors: {
  brand: {
    50:  '#eef6f4',
    100: '#d7e9e4',
    500: '#0f6b5c',   // primary — deep teal (trust, civic, growth)
    600: '#0c5449',
    700: '#093f37',
  },
  accent: {
    500: '#d97706',   // amber — CTAs, priority/urgency highlights
    600: '#b45309',
  },
  status: {
    reported:   '#94a3b8', // slate — REPORTED
    verified:   '#3b82f6', // blue — VERIFIED
    assigned:   '#8b5cf6', // violet — ASSIGNED
    inprogress: '#d97706', // amber — IN_PROGRESS
    resolved:   '#16a34a', // green — RESOLVED
    rejected:   '#dc2626', // red — REJECTED
  },
  neutral: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
    500: '#64748b', 700: '#334155', 900: '#0f172a',
  },
}
```
- `status.*` maps 1:1 to backend context's `IssueStatus` enum (`REPORTED, VERIFIED, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED`) — use these exact colors anywhere a status badge/pill is rendered, across all three views, for consistency.
- Domain/category tags (Section 8's canonical list) get a secondary, muted color set (neutral-100 background + brand-700 text) rather than their own rainbow — status color should always dominate visually over category color.

### 13.3 Typography
```js
// tailwind.config.js — theme.extend.fontFamily
fontFamily: {
  sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'], // Noto Sans Devanagari ensures Hindi text renders cleanly alongside English
}
```
- Scale: `text-sm` (labels/meta) · `text-base` (body) · `text-lg` (section headers) · `text-2xl` (page titles) · `text-3xl` (dashboard metric numbers).
- Weight: `font-semibold` for headers/labels, `font-normal` for body — avoid more than 2 weights per screen.

### 13.4 Spacing & Layout
- Base spacing unit: Tailwind default (`4px` grid).
- Page container: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.
- Card padding: `p-4` (mobile) → `p-6` (desktop, via `sm:p-6`).
- Section gaps: `space-y-6` between major blocks within a view.
- Touch targets (buttons/inputs): minimum `h-11` (44px) — accounts for lower digital literacy / potentially older or non-precise-pointer devices in rural use.

### 13.5 Core Reusable Components (Tailwind utility patterns)

**Button (primary)**
```html
<button class="h-11 px-5 rounded-lg bg-brand-500 text-white font-semibold
  hover:bg-brand-600 active:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors">
  Submit Issue
</button>
```

**Button (secondary/outline)**
```html
<button class="h-11 px-5 rounded-lg border border-brand-500 text-brand-500 font-semibold
  hover:bg-brand-50 transition-colors">
  Cancel
</button>
```

**Status badge**
```html
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
  bg-[color:var(--status-bg)] text-[color:var(--status-text)]">
  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
  In Progress
</span>
<!-- set --status-bg / --status-text per status color from Section 13.2, or use Tailwind's
     bg-status-inprogress/10 text-status-inprogress pattern if extending the plugin for opacity variants -->
```

**Card (issue/project list item)**
```html
<div class="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 shadow-sm
  hover:shadow-md transition-shadow">
  <div class="flex items-start justify-between gap-3">
    <h3 class="text-lg font-semibold text-neutral-900">Issue Title</h3>
    <!-- status badge here -->
  </div>
  <p class="text-sm text-neutral-500 mt-1">Category · Location · Date</p>
  <p class="text-base text-neutral-700 mt-3">Description preview…</p>
</div>
```

**Metric card (dashboard)**
```html
<div class="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col gap-1">
  <span class="text-sm text-neutral-500 font-medium">Total Submissions</span>
  <span class="text-3xl font-semibold text-brand-700">1,284</span>
</div>
```

**Kanban column (University Nodal Workspace)**
```html
<div class="bg-neutral-50 rounded-xl p-3 w-72 flex-shrink-0">
  <h4 class="text-sm font-semibold text-neutral-700 px-2 pb-2">To Do</h4>
  <div class="space-y-2"><!-- task cards --></div>
</div>
```

**Form input**
```html
<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-neutral-700">Description</label>
  <textarea class="min-h-[120px] rounded-lg border border-neutral-200 p-3 text-base
    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
    placeholder="भाषा में या अंग्रेज़ी में लिखें / Write in your language or English"></textarea>
</div>
```

### 13.6 Per-View Layout Guidance

**View 1 — Citizen Submission Form**
- Single-column, centered form (`max-w-xl mx-auto`), large touch targets, one field visible at a time is NOT required (keep it a single scrollable form, not a multi-step wizard, for prototype simplicity).
- Post-submission AI feedback (category tag, dedup flag, routed university) renders as a highlighted `bg-brand-50 border border-brand-100 rounded-xl p-4` summary card directly below the submit button.

**View 2 — University Nodal Workspace**
- Two-pane layout: left = "Assigned Challenges" inbox list (cards per Section 13.5), right/below = Kanban board (horizontal-scroll on mobile, `flex gap-4 overflow-x-auto`).
- "Accept & Assign Team" opens a lightweight modal/inline form, not a separate page.

**View 3 — Government Analytics Dashboard**
- Top row: metric cards in a responsive grid (`grid grid-cols-1 sm:grid-cols-3 gap-4`).
- Below: map (left/larger, `lg:col-span-2`) + domain distribution chart (right/smaller) in a `grid lg:grid-cols-3 gap-6` layout.
- Map pins colored by **domain/category**, not status (dashboard's job is showing distribution across sectors, not per-issue progress).

### 13.7 Accessibility Baseline (minimum, prototype scope)
- All interactive elements reachable via keyboard (native `<button>`/`<a>`/`<input>` elements, no div-as-button anti-pattern).
- Color is never the only status signal — every status badge pairs color with a text label (per Section 13.5's badge pattern).
- Minimum text contrast: body text uses `neutral-700`+ on white/`neutral-50` backgrounds, never `neutral-500` for primary content (500 reserved for secondary/meta text only).

### 13.8 Explicitly Deferred (design scope)
- No dark mode.
- No animation/motion system beyond Tailwind's default `transition-colors`/`transition-shadow` utilities.
- No icon library specified — pick any (e.g. `lucide-react`) and apply consistently; not a doc-sourced or fixed decision.
- No full component library (e.g. shadcn/ui) mandated — the patterns in 13.5 are plain Tailwind and framework-agnostic; adopting a component library on top is an acceptable implementation choice, not a requirement.

---

## 14. USAGE NOTES FOR AI AGENTS

- Default to **prototype scope (Sections 3–10, 12–13)** for any code-generation, component-design, or "what should the frontend do" question — never silently pull in Section 11's production stack.
- If asked to "make it more polished/production-ready" without an explicit request for full production scale, clarify whether the ask stays within prototype/hackathon scope or now targets Section 11's vision — do not assume escalation.
- The three-views structure (Section 3), the API contract (Sections 9 & 12), and the design system (Section 13) are the most load-bearing pieces of this file — new components should map to one of the three named views, use the color/typography/component tokens in Section 13 rather than inventing new ones, and new API calls should match the controller list in Sections 9/12 (cross-check `samadhansetu_backend_context.md` Section 2 before inventing a new endpoint name).
- Section 13 (UI/UX) and Section 12.3's exact endpoint paths are **original decisions made for this project, not doc-sourced from PS26043/misc.md/backend PDF** — if the user asks "is this from the docs," answer honestly that these are project-level design/implementation decisions, distinct from Sections 1–11 which trace back to source material.
- This file does not cover: detailed component file structure beyond Section 12.2's API-layer folder, exact routing paths, or a full component library — do not invent beyond what Sections 12–13 already specify; propose sensible defaults explicitly marked as your own suggestion when asked for more.
