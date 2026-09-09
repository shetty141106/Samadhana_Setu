# SamadhanSetu — Remaining Work

**Updated:** 2026-09-09

This document lists work that remains after the latest cross-layer static audit. `readme/PROJECT_CONTEXT.md` is intentionally excluded from this update.

## 1. P0 — Fix Issue API Contract

These are confirmed implementation mismatches and should be fixed before final end-to-end testing.

### 1.1 Priority enum alignment

Frontend currently sends:

```text
Critical
High
Medium
Low
```

Backend `IssuePriority` expects:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

Normalize the frontend payload or explicitly change the backend contract. Do not rely on Jackson accepting the human-readable values.

### 1.2 Category persistence

Frontend collects/sends `category` and `categoryLabel`, but `IssueRequestDto` currently does not contain category. Align:

```text
IssueForm
 → IssueRequestDto
 → Issue entity
 → IssueResponseDto
 → Admin/Nodal/Citizen UI
```

### 1.3 District persistence

Frontend collects `district`, but the current backend request DTO, Issue entity and response DTO do not model it. Add the field consistently if district is part of the intended issue record.

### 1.4 Admin All Issues response

The Admin All Issues page is connected to `/api/issues`, but the current response lacks:

```text
category
district
citizen name/email
```

Align the response DTO and frontend mapping so the page can show real database-backed basic information.

## 2. P1 — Hosted Runtime Verification

- [ ] Verify deployed Spring Boot startup/API response.
- [ ] Verify deployed FastAPI AI service connectivity from Spring Boot.
- [ ] Verify Vercel frontend reaches Render backend.
- [ ] Verify production CORS.
- [ ] Verify JWT login and role-protected API behavior.
- [ ] Verify registration creates the expected database records.
- [ ] Verify TiDB persistence for the complete issue record.

## 3. P1 — Live AI Verification

- [ ] Configure/verify `GEMINI_API_KEY` in the AI service runtime.
- [ ] Verify live Gemini translation/classification/summarization.
- [ ] Verify live embeddings + FAISS duplicate detection.
- [ ] Verify AI result is returned to the frontend after issue creation.
- [ ] Verify deterministic fallback by making the external AI unavailable.

## 4. P1 — Complete End-to-End Workflow

After the issue contract is corrected:

```text
Citizen registration/login
  → issue + exact GPS + optional evidence
  → Spring Boot persistence
  → AI processing
  → category/priority/deduplication
  → university/department routing
  → Nodal verification
  → Faculty/Student project workflow
  → Kanban task updates
  → milestone validation
  → Industry/CSR sponsorship
  → Admin All Issues/GIS/analytics
  → notification/session verification
```

## 5. P2 — Role / Governance Cleanup

- [ ] Decide whether Admin should be allowed to create `STUDENT` accounts through `/api/users`. Current code supports it, while the latest requested privileged-role list explicitly named Nodal Officer, Faculty, Industry/CSR Partner and System Admin.
- [ ] Verify six-role seeded/demo accounts against the deployed database.
- [ ] Verify each role receives only its intended dashboard and API permissions.

## 6. P2 — Demo Data / Presentation Cleanup

Important UI values that are not directly supplied by live APIs must be clearly labelled or replaced with backend aggregates:

- [ ] Faculty KPIs where live aggregates exist.
- [ ] Student mentor/KPI presentation values where live data exists.
- [ ] Any remaining Admin demo-only governance metadata.
- [ ] Confirm Admin charts use real dashboard data when live mode is enabled.

## 7. P2 — Upvote Persistence

Current issue upvotes use user-scoped browser `localStorage`. This prevents simple repeated clicks in the same browser/user context but is not a server-side persistent voting system.

If persistent/global upvotes are required:

```text
Upvote API
 → authenticated user
 → database record/constraint
 → aggregate count
```

Otherwise keep the current behavior and document it as a prototype presentation feature.

## 8. P2 — AI Transaction Hardening

AI processing currently occurs during issue creation after the issue is saved and is coupled to the service transaction. For the prototype this is acceptable once fallback behavior is verified.

Optional future hardening:

```text
Create + commit issue
       ↓
async AI processing
       ↓
update issue / AiAnalysis
```

Do not implement this unless runtime reliability requires it.

## 9. Testing Completion

- [ ] Clean Maven build/test suite.
- [ ] Controller/API tests for authentication and issue contracts.
- [ ] Issue create request/response integration test.
- [ ] Category/district persistence test after DTO/entity alignment.
- [ ] Project/team/task/milestone integration test.
- [ ] Industry/CSR integration test.
- [ ] Dashboard integration test.
- [ ] Notification ownership/security test.
- [ ] Frontend production build verification.
- [ ] Deployed six-role runtime test.

## 10. Cloudinary — Known External Requirement

Cloudinary is intentionally excluded from the core blocker list except when evidence upload is demonstrated.

Required frontend deployment variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=<cloud name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned upload preset>
```

Do not commit secrets. Evidence upload should be tested separately from the text/location issue API.

## Completion Rule

Do **not** mark the project 100% complete merely because code exists. The final prototype is complete only after:

1. issue request/response contracts are aligned;
2. database persistence is verified;
3. deployed authentication/RBAC is verified;
4. live AI/fallback behavior is verified;
5. routing/project/CSR/admin flow is verified;
6. remaining demo-only values are explicitly labelled or replaced;
7. the complete deployed SIH walkthrough passes.
