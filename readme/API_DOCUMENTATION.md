# SamadhanSetu API Documentation

## OpenAPI / Swagger UI

The Spring Boot backend now uses `springdoc-openapi` for runtime-generated OpenAPI documentation.

When the backend is running locally:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- OpenAPI YAML: `http://localhost:8080/v3/api-docs.yaml`

The OpenAPI document is generated from the actual Spring MVC controllers and DTOs, so newly added REST endpoints are included automatically.

## Authentication

Authentication is JWT-based.

1. Register/login through the `/api/auth/**` endpoints.
2. Copy the JWT returned by login.
3. In Swagger UI select **Authorize**.
4. Enter the token using the HTTP bearer scheme.
5. Swagger will send the JWT as `Authorization: Bearer <token>` for protected endpoints.

The OpenAPI security scheme is named `bearerAuth` and uses HTTP Bearer/JWT.

## API Areas

The current backend controllers are documented automatically under these functional areas:

### Authentication

Controller: `AuthController`

Base path: `/api/auth`

Provides registration and login operations.

### Citizen Issues

Controller: `IssueController`

Base path: `/api/issues`

Provides citizen issue creation and issue retrieval/workflow operations. New citizen issues also trigger the prototype AI processing pipeline.

### AI / Problem Processing

Controller: `AiIntegrationController`

Base path: `/api/ai`

Provides Spring Boot integration with the standalone FastAPI AI service and its structured AI processing contract.

### University / Department / Faculty

Controllers:

- `UniversityController` — `/api/universities`
- `DepartmentController` — `/api/departments`
- `FacultyProfileController` — `/api/faculty-profiles`
- `UniversityRoutingController` — university routing operations

These APIs support university collaboration, department/faculty management, search, and AI-category-based routing.

### Projects / Teams / Milestones / Tasks

Controller: `ProjectController`

Base path: `/api/projects`

Provides project lifecycle, team, milestone, task, assignment, and progress operations.

### Industry / CSR

Controller: `IndustryController`

Base path: `/api/industry`

Provides organization, verification, sponsorship, and industry/CSR collaboration operations exposed by the controller.

### Dashboard / Analytics

Controller: `DashboardController`

Base path: `/api/dashboard`

Provides government-facing summary, issue, project, task, university, geographic, and sponsorship analytics.

### Notifications

Controller: `NotificationController`

Base path: `/api/notifications`

Provides notification creation, retrieval, unread counts, read-state updates, and deletion.

## Security Notes

- Swagger UI and OpenAPI specification endpoints are intentionally public so the API documentation can be opened before authentication.
- Business APIs retain the existing Spring Security role restrictions.
- JWT authentication remains the application authentication mechanism.
- No secrets or Gemini API keys are included in the API documentation.

## Prototype AI Service

The Spring Boot API integrates with the FastAPI AI service through the configured `ai.service.url` property. The live Gemini key remains an external environment configuration and is not stored in GitHub.

## Source of Truth

The project architecture and API behavior remain governed by `readme/PROJECT_CONTEXT.md` and the AI/ML prototype specification in `readme/ai_ml_context.md`.
