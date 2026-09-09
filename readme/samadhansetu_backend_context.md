# SAMADHANSETU — BACKEND IMPLEMENTATION CONTEXT

> **Backend implementation source of truth.** Reconciled against the current repository implementation on `main`. `readme/PROJECT_CONTEXT.md` remains authoritative for the problem statement and product scope and is intentionally not modified by this update.

## 1. Project Metadata

- Project: SamadhanSetu
- SIH: 2026 PS26043 — Government of Jharkhand
- Backend: Spring Boot + Java
- Persistence: Spring Data JPA + MySQL/TiDB-compatible relational configuration
- Security: Spring Security + JWT
- Build: Maven
- AI: Spring Boot bridge to standalone Python FastAPI service
- Architecture: Controller → Service → Repository → Entity/Database
- Repository: `shetty141106/Samadhana_Setu`
- Branch: `main`

## 2. Current Backend Status

The backend contains the major prototype modules, but it is **not yet safe to describe the issue-management contract as fully complete**. Static audit identified concrete API/model mismatches that must be resolved before final end-to-end verification.

### Confirmed current implementation

- JWT authentication/RBAC is implemented.
- Citizen registration/login endpoints exist.
- Citizen issue creation and operational issue retrieval exist.
- AI bridge and deterministic fallback exist.
- University/department/faculty APIs exist.
- Project/team/milestone/task lifecycle exists.
- Industry/CSR APIs exist.
- Dashboard/notification APIs exist.
- Admin user creation is restricted to Admin users.

### Confirmed contract gaps

1. `IssueRequestDto` does not contain `category` or `district`, although the frontend sends both.
2. `Issue` contains `category` but does not contain a `district` field.
3. `IssueResponseDto` does not expose `category`, `district`, or citizen name/email.
4. The frontend currently sends `High`/`Medium`/`Low`/`Critical`, while `IssuePriority` expects uppercase enum names. This can cause request deserialization failure.
5. Admin All Issues is therefore only partially populated from live backend data until the issue DTO/entity contract is aligned.

These are implementation issues, not documentation-only concerns.

## 3. Module Architecture

| # | Module | Controller | Service | Repository / Core |
|---|---|---|---|---|
| 1 | Authentication & RBAC | `AuthController` | `AuthService`, `UserService` | `UserRepository`, `RoleRepository` |
| 2 | Citizen Ingestion | `IssueController` | `IssueService` | `IssueRepository`, `CitizenRepository` |
| 3 | AI Orchestration | `AiIntegrationController` | `AiBridgeService` | `IssueRepository`, `AiAnalysisRepository` |
| 4 | Academic Workspace | `UniversityController`, `DepartmentController`, `FacultyProfileController` | corresponding services | University/Department/Faculty repositories |
| 5 | R&D & Kanban Lifecycle | `ProjectController` | `ProjectService` | Project/Task/Milestone repositories |
| 6 | Industry & CSR | `IndustryController` | `IndustryService`, `VerificationService` | Organization/Sponsorship repositories |
| 7 | Analytics & Heatmaps | `DashboardController` | `DashboardService` | issue/project aggregations |
| 8 | Notifications | `NotificationController` | `NotificationService` | `NotificationRepository` |
| 9 | Admin User Governance | `UserAdminController` | `AdminUserService` | `UserRepository`, `RoleRepository` |

## 4. Entity Inventory

The core JPA model includes the stakeholder/profile, civic issue, academic, project, Industry/CSR and notification entities documented by the repository.

Important issue model fields currently include:

```text
Issue
 ├─ id
 ├─ title
 ├─ description
 ├─ location
 ├─ latitude
 ├─ longitude
 ├─ category
 ├─ status
 ├─ priority
 ├─ reportedBy
 ├─ evidenceMedia
 └─ aiAnalyses
```

**Current gap:** district is not an `Issue` entity field even though the frontend collects it.

Enums include:

```text
RoleName
IssueStatus
IssuePriority
ProjectStatus
MilestoneStatus
TaskStatus
```

## 5. Relationship Model

```text
Role
 ↓
User
 ├── Citizen
 ├── NodalOfficer
 ├── Faculty
 ├── Student
 ├── Industry
 └── Admin

Citizen → Issue → EvidenceMedia
Issue → AiAnalysis
University → Department → FacultyProfile
University → Project
Project → TeamMember
Project → Milestone → Task
Project → Task
Organization → Sponsorship → Project
User → Notification
```

## 6. Security / RBAC

Implemented:

- JWT authentication
- custom user-details handling
- role authorities for six stakeholder roles
- Admin-only `/api/users/**`
- citizen-only issue creation
- Admin/Nodal operational issue listing
- Admin/Nodal issue mutation
- authenticated AI APIs
- Admin/Nodal dashboard APIs
- authenticated notification access with user ownership checks
- project-level mutation authorization
- method security
- invalid/expired JWT handling
- request validation
- environment-driven signing secret

`JWT_SECRET` must remain outside source control.

## 7. Citizen Issue Workflow — Current Contract

```text
Citizen frontend
 → POST /api/issues
 → IssueController
 → IssueService.create()
 → IssueRepository
 → AiBridgeService.processIssue()
 → AI/fallback result
 → Issue + AiAnalysis persistence
 → REST response
```

Issue statuses:

```text
REPORTED
VERIFIED
ASSIGNED
IN_PROGRESS
RESOLVED
REJECTED
```

Issue priorities:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### Current request contract

`IssueRequestDto` currently accepts:

```text
title
description
location
latitude
longitude
priority
evidenceMedia
```

It currently does **not** accept:

```text
category
district
```

### Required alignment before final verification

The frontend currently sends category and district and expects them to be retained. The backend contract must be extended consistently across request DTO, entity/database and response DTO before this can be considered complete.

Priority values must be normalized to enum values before Jackson deserialization, or the API contract must explicitly accept the frontend representation.

## 8. Issue Response / Admin All Issues

Current `IssueResponseDto` contains:

```text
id
title
description
location
latitude
longitude
status
priority
citizenId
evidenceMedia
aiAnalysis
```

It does not currently contain:

```text
category
district
citizenName
citizenEmail
```

Therefore the Admin All Issues page can retrieve the live issue list but cannot currently populate all of its intended basic-info columns from the backend.

## 9. AI Integration

Spring Boot delegates processing to the configured FastAPI service through `AiBridgeService`.

The bridge:

- builds an AI request from the persisted issue;
- calls the configured AI service;
- falls back to deterministic local rules when the external call fails;
- applies AI category/priority results to the issue;
- enriches university recommendation through `UniversityRoutingService`;
- persists an `AiAnalysis` record;
- exposes the latest analysis through issue responses.

### Transaction note

Issue creation currently invokes AI processing from inside the issue creation transaction. This works with the existing exception fallback but couples issue persistence to downstream AI processing. A future hardening option is to persist/commit the issue first and process AI asynchronously. This is not required for the current prototype unless runtime failures demonstrate a need.

## 10. University / Academic Workspace

Implemented:

- University CRUD/search
- Department management/listing
- Faculty profile management
- specialization lookup
- category-based routing
- recommended university enrichment

The current routing implementation is a deterministic heuristic over department names/keywords. It is suitable for prototype demonstration, not a production institutional-ranking engine.

## 11. Project / Team / Kanban

Implemented:

- Project CRUD/lifecycle
- project ↔ university
- team-member management
- duplicate team-member prevention
- milestone creation/listing/status
- task creation/listing/update/delete
- task assignment
- milestone linkage
- project progress counters
- project-level authorization

Task statuses:

```text
TODO
IN_PROGRESS
REVIEW
DONE
```

Project statuses:

```text
PLANNED
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
```

## 12. Industry / CSR

Implemented:

- organization CRUD/search
- organization verification readiness
- verification operations
- sponsorship creation/management
- sponsorship ↔ project relationship
- sponsorship status handling

The prototype records sponsorship information; it does not implement real payment settlement.

## 13. Dashboard / Analytics

Implemented API-level aggregation for issue status, priority/category, project/task status, university participation, geographic/location analytics and sponsorship metrics where exposed by the dashboard controller.

Frontend presentation must distinguish live aggregates from remaining demo-oriented values.

## 14. Notifications

Implemented:

- notification creation
- user notification listing
- unread listing/count
- mark read
- delete
- authenticated ownership checks

## 15. Admin User Governance

`/api/users/**` is protected by `ADMIN` role in `SecurityConfig`.

`AdminUserService` currently permits:

```text
NODAL_OFFICER
FACULTY
STUDENT
INDUSTRY
ADMIN
```

The current product request mentioned four privileged roles: Nodal Officer, Academic Faculty, Industry/CSR Partner and System Admin. If the intended contract is strictly those four, the `STUDENT` option must be removed from both frontend and backend allowed-role lists. Until then, the repository technically supports five admin-created non-citizen roles.

## 16. Environment / Deployment Contract

Deployment values remain external:

```env
JWT_SECRET=<secret>
CORS_ALLOWED_ORIGINS=<frontend-origin>
SPRING_DATASOURCE_URL=<database-url>
SPRING_DATASOURCE_USERNAME=<database-user>
SPRING_DATASOURCE_PASSWORD=<database-password>
AI_SERVICE_URL=<fastapi-url>
```

AI runtime:

```env
GEMINI_API_KEY=<secret>
```

Never commit secrets.

## 17. Testing / Verification Status

### Code-level capabilities present

- [x] JWT service tests
- [x] AI processing/fallback tests
- [x] university routing tests
- [x] notification tests
- [x] semantic deduplication tests
- [x] service-level prototype coverage in existing test suite

### Still required

- [ ] clean Maven build/test verification
- [ ] controller/API tests for the current DTO contracts
- [ ] issue create request/response integration test
- [ ] category/district persistence test after contract alignment
- [ ] project/team/task integration test
- [ ] Industry/CSR integration test
- [ ] dashboard integration test
- [ ] deployed TiDB/Render runtime verification
- [ ] live FastAPI/Gemini verification
- [ ] complete end-to-end workflow test

## 18. API Documentation

`readme/API_DOCUMENTATION.md` describes the current endpoint groups. Exact controller and DTO code remains authoritative if documentation and implementation diverge.

## 19. Completion Rule

Backend prototype architecture is substantially implemented, but the **current issue API contract is not fully aligned with the frontend**. Do not claim backend 100% complete until the priority/category/district/response mismatches are corrected and the deployed workflow is verified.

Do not expand into production-scale microservices, PostGIS, advanced ML ranking or MLOps unless explicitly requested.
