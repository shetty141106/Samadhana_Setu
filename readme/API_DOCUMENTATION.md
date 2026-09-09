# SamadhanSetu API Documentation

> This document describes the current Spring Boot API surface. Exact controller/DTO code remains authoritative. `readme/PROJECT_CONTEXT.md` is intentionally not modified by this documentation update.

## OpenAPI / Swagger UI

The Spring Boot backend uses `springdoc-openapi` for runtime-generated OpenAPI documentation.

When running locally:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- OpenAPI YAML: `http://localhost:8080/v3/api-docs.yaml`

The OpenAPI document is generated from the actual Spring MVC controllers and DTOs.

## Authentication

Authentication is JWT-based.

```text
POST /api/auth/register
POST /api/auth/login
```

Protected endpoints require:

```http
Authorization: Bearer <JWT>
```

The frontend stores the JWT through the centralized API client. Invalid/expired JWTs produce an authentication failure and clear the client session.

## API Areas

### 1. Authentication

Controller: `AuthController`  
Base path: `/api/auth`

Provides registration and login.

Current registration contract creates citizen accounts; privileged role provisioning is handled separately through Admin user governance.

### 2. Citizen Issues

Controller: `IssueController`  
Base path: `/api/issues`

Core operations include:

```text
POST   /api/issues
GET    /api/issues
GET    /api/issues/{id}
GET    /api/issues/citizen/{id}
GET    /api/issues/status/{status}
GET    /api/issues/priority/{priority}
PUT    /api/issues/{id}
PATCH  /api/issues/{id}
POST   /api/issues/{id}/evidence
DELETE /api/issues/{id}
```

Authorization currently includes:

- citizen: create issues and access own issue records/evidence where permitted;
- Admin/Nodal Officer: operational issue listing and mutation;
- authenticated users: protected individual issue access subject to backend ownership rules.

### Current Issue Request Contract

`IssueRequestDto` currently accepts:

```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "latitude": "string",
  "longitude": "string",
  "priority": "HIGH",
  "evidenceMedia": []
}
```

`priority` must match the backend enum:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

**Known integration gap:** the current frontend also sends `category` and `district`, but the current backend request DTO does not accept those fields. District is also not currently a field on the `Issue` entity. These contracts must be aligned before category/district can be considered persisted issue data.

### Current Issue Response Contract

The current `IssueResponseDto` contains:

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

It currently does not contain `category`, `district`, `citizenName` or `citizenEmail`. This is relevant to the Admin All Issues page, which currently has UI fields for richer issue metadata.

### Issue Status

```text
REPORTED
VERIFIED
ASSIGNED
IN_PROGRESS
RESOLVED
REJECTED
```

### Issue Priority

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### Evidence

Evidence is represented by media URL/type metadata. The frontend may upload evidence to Cloudinary before submitting the issue; Cloudinary configuration is external to the Spring Boot API.

### 3. AI / Problem Processing

Controller: `AiIntegrationController`  
Base path: `/api/ai`

Spring Boot uses `AiBridgeService` to communicate with the standalone FastAPI AI service.

AI processing supports the prototype result contract for:

- language
- translation
- summary
- category/domain
- confidence
- priority/score/reasons
- duplicate match
- university recommendation
- processing source

The backend also has deterministic fallback behavior when the external AI service fails.

### 4. University / Department / Faculty

Controllers:

- `UniversityController` — `/api/universities`
- `DepartmentController` — `/api/departments`
- `FacultyProfileController` — `/api/faculty-profiles`
- `UniversityRoutingController` — routing operations

These support university collaboration, department/faculty management, search and category-based routing.

### 5. Projects / Teams / Milestones / Tasks

Controller: `ProjectController`  
Base path: `/api/projects`

Supports project lifecycle, university relationship, team membership, milestones, tasks, assignment and progress.

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

### 6. Industry / CSR

Controller: `IndustryController`  
Base path: `/api/industry`

Supports organizations, verification, sponsorship records and project relationships. Real payment settlement is outside prototype scope.

### 7. Dashboard / Analytics

Controller: `DashboardController`  
Base path: `/api/dashboard`

Provides government-facing summary and aggregation endpoints for issue/project/task/university/geographic/sponsorship analytics where implemented.

### 8. Notifications

Controller: `NotificationController`  
Base path: `/api/notifications`

Supports notification creation, user listing, unread listing/count, mark-read and deletion. User ownership is checked server-side for user-scoped operations.

### 9. Admin User Governance

Controller: `UserAdminController`  
Base path: `/api/users`

```text
GET  /api/users
POST /api/users
```

Both endpoints are protected by `ADMIN` role.

Current backend-created roles are:

```text
NODAL_OFFICER
FACULTY
STUDENT
INDUSTRY
ADMIN
```

If product scope requires exactly the four privileged roles currently specified by the team, the `STUDENT` option must be removed from this admin-created role contract.

## Security Notes

- Swagger/OpenAPI endpoints are intentionally public.
- `/api/auth/**` is public for registration/login.
- `/api/users/**` is Admin-only.
- Issue creation is citizen-only.
- Operational issue listing/mutation is Admin/Nodal.
- AI and dashboard APIs are protected.
- Notification access is authenticated and user-scoped.
- JWT signing secret is external configuration.

## Deployment API Base

Production frontend is configured to call:

```text
https://samadhana-setu.onrender.com
```

The Spring Boot AI bridge is configured through:

```env
AI_SERVICE_URL=<FastAPI endpoint>
```

## Prototype AI Service

The Spring Boot service calls the FastAPI AI service; the browser does not call FastAPI/Gemini directly.

The AI runtime requires `GEMINI_API_KEY` for live Gemini behavior. The backend fallback can still produce deterministic prototype results when the external service is unavailable.

## Current Integration Warnings

Before declaring the API fully integrated with the frontend:

1. Align issue priority representation (`High` vs `HIGH`).
2. Add/align category across request/entity/response if it is intended as persisted issue data.
3. Add/align district across request/entity/response if it is intended as persisted issue data.
4. Extend issue response metadata for the Admin All Issues page if citizen/category/district information is required there.
5. Verify the complete deployed issue → AI → routing workflow.

## Source of Truth

`readme/samadhansetu_backend_context.md` describes backend architecture. `readme/frontend_context.md` describes frontend implementation. If this document differs from actual controller/DTO behavior, the code is authoritative and this document should be updated.
