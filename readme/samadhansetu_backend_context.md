# SAMADHANSETU — BACKEND IMPLEMENTATION CONTEXT

> **Backend implementation source of truth.** Reconciled against the current project state on `main` as of 2026-09-06. `readme/PROJECT_CONTEXT.md` remains authoritative for the problem statement and product scope; this file is authoritative for backend implementation architecture and continuation.

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

The backend core implementation for the SIH prototype is **complete at code level** across authentication, citizen ingestion, AI orchestration, university collaboration, R&D lifecycle, Industry/CSR, analytics, notifications and security.

The remaining backend work is primarily:

- broader automated test coverage;
- clean-build/runtime verification;
- live Gemini verification;
- deployed service verification;
- final end-to-end citizen → AI → university → project workflow verification.

## 3. Module Architecture

| # | Module | Controller | Service | Repository / Core |
|---|---|---|---|---|
| 1 | Authentication & RBAC | `AuthController` | `AuthService`, `UserService` | `UserRepository`, `RoleRepository` |
| 2 | Citizen Ingestion | `IssueController` | `IssueService` | `IssueRepository` |
| 3 | AI Orchestration | `AiIntegrationController` | `AiBridgeService` | `IssueRepository`, `UniversityRepository` |
| 4 | Academic Workspace | `UniversityController` | `UniversityService` | `UniversityRepository` |
| 5 | R&D & Kanban Lifecycle | `ProjectController` | `ProjectService` | `ProjectRepository`, `TaskRepository` |
| 6 | Industry & CSR | `IndustryController` | `IndustryService`, `VerificationService` | `OrganizationRepository`, `SponsorshipRepository` |
| 7 | Analytics & Heatmaps | `DashboardController` | `DashboardService` | issue/project aggregations |
| 8 | Notifications | `NotificationController` | `NotificationService` | `NotificationRepository` |

## 4. Entity Inventory

The core JPA model contains 20 entities:

1. Role
2. User
3. Citizen
4. NodalOfficer
5. Faculty
6. Student
7. Industry
8. Admin
9. Issue
10. EvidenceMedia
11. University
12. Department
13. FacultyProfile
14. Project
15. TeamMember
16. Milestone
17. Task
18. Organization
19. Sponsorship
20. Notification

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
University → Department → FacultyProfile → Faculty
University → Project
Project → TeamMember
Project → Milestone → Task
Project → Task
Industry → Organization → Sponsorship → Project
User → Notification
```

CIN/GSTIN/Udyam remain fields on `Organization`; they are not separate entities.

AI and dashboard analytics do not require dedicated JPA entities for the prototype.

## 6. Security / RBAC

Implemented:

- JWT authentication
- custom user-details handling
- role authorities for all six stakeholder roles
- protected management endpoints
- authenticated notification APIs
- citizen-only issue creation authorization
- protected AI/dashboard endpoints
- invalid/expired JWT handling
- security-context cleanup
- method security
- global exception handling
- request validation
- environment-driven signing secret

Production `JWT_SECRET` must remain outside source control.

## 7. Citizen Issue Workflow

```text
Citizen creates Issue
 → validate request
 → persist Issue
 → invoke AI bridge
 → persist/enrich AI result
 → category-based university routing
 → expose result through REST APIs
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

Evidence is represented through `EvidenceMedia` and associated media URLs/metadata.

## 8. AI Integration

Spring Boot delegates prototype AI processing to the Python FastAPI service through `AiBridgeService`.

Prototype AI responsibilities:

- Hindi/English handling
- translation
- summarization
- canonical domain classification
- prototype priority scoring
- Gemini embeddings
- FAISS semantic deduplication
- optional coordinate distance
- rule-based university/department routing

The AI service has deterministic fallback behavior.

Live Gemini execution requires `GEMINI_API_KEY` in the AI runtime environment. Never commit it.

## 9. University / Academic Workspace

Implemented:

- University CRUD/search
- Department management/listing
- Faculty integration
- Faculty profile management/search
- specialization lookup
- category-based routing
- recommended university enrichment

## 10. Project / Team / Kanban

Implemented:

- Project CRUD/lifecycle
- project ↔ university
- team-member management
- duplicate team-member prevention
- milestone creation/listing/status
- task creation/listing/update/delete
- task assignment
- milestone linkage
- Kanban statuses
- project progress counters

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

## 11. Industry / CSR

Implemented:

- organization CRUD/search
- organization verification readiness
- verification endpoint
- sponsorship creation/management
- sponsorship ↔ project relationship
- sponsorship lookup/status handling

The prototype records sponsorship information; real payment settlement is outside the current scope.

## 12. Dashboard / Analytics

Implemented API-level aggregation for:

- overall summary
- issue status
- issue priority
- issue category/domain
- project status
- task status
- university participation
- geographic/location analytics
- sponsorship counts and funding totals

Frontend may still contain demo presentation values; those must be clearly treated as demo values until replaced by live aggregates.

## 13. Notifications

Implemented:

- notification creation
- user notification listing
- unread listing/count
- mark read
- delete
- REST controller/service/repository

## 14. Environment / Deployment Contract

Deployment values remain external:

```env
JWT_SECRET=<secret>
CORS_ALLOWED_ORIGINS=<frontend-origin>
SPRING_DATASOURCE_URL=<database-url>
SPRING_DATASOURCE_USERNAME=<database-user>
SPRING_DATASOURCE_PASSWORD=<database-password>
AI_SERVICE_URL=<fastapi-url>
```

AI runtime additionally needs:

```env
GEMINI_API_KEY=<secret>
```

Never commit secrets.

## 15. Testing Status

### Implemented

- [x] University service tests
- [x] Notification service tests
- [x] AI processing tests
- [x] University routing tests
- [x] JWT service tests
- [x] FAISS semantic deduplication tests
- [x] AI fallback contract tests

### Remaining verification

- [ ] Repository tests
- [ ] Controller/API tests
- [ ] Project/team lifecycle tests
- [ ] Industry/CSR tests
- [ ] Dashboard analytics tests
- [ ] Integration tests
- [ ] End-to-end workflow test
- [ ] Clean Maven build/runtime verification
- [ ] Live Gemini runtime verification

## 16. API Documentation

`readme/API_DOCUMENTATION.md` is the current API reference for frontend/backend integration. Exact controller code remains authoritative if documentation and implementation diverge.

## 17. Final Backend Completion Rule

Backend prototype implementation is **complete at architecture/code level**. It should be marked fully complete only after clean build, live AI, deployed service and end-to-end workflow verification pass.

Do not expand into production-scale microservices, PostGIS, advanced ML ranking, or MLOps unless explicitly requested.
