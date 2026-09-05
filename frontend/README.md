# SamadhanSetu Frontend

SIH 2026 prototype frontend for the SamadhanSetu civic innovation portal.

## Run locally

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite app defaults to `http://localhost:5173` and the API defaults to `http://localhost:8080`.

## Views

- Citizen: home, report challenge, track reports
- University Nodal: assigned challenge inbox + Kanban workflow
- Government Admin: executive metrics, issue map, domain analytics, institutional network
- Auth: JWT login/register with role-aware navigation

## Backend integration

The app uses Axios and sends `Authorization: Bearer <token>` when a token exists. It targets the implemented Spring Boot routes for auth, issues and dashboard data. If the backend is unavailable, the demo views remain usable with presentation data so the SIH walkthrough can still be demonstrated.

## Environment

See `.env.example`. No Gemini/AI secret belongs in the frontend; AI processing is mediated by the Spring Boot backend.
