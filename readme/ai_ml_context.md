# SAMADHANSETU — AI/ML LAYER CONTEXT (IMPLEMENTED PROTOTYPE)

> **AI/ML implementation source of truth for the current SIH prototype.** Reconciled against the repository implementation on `main` as of 2026-09-06. This file describes the implemented prototype, its boundaries, and the remaining runtime verification. Production-scale AI remains future scope.

## 1. Scope

- Service: standalone Python FastAPI microservice.
- Caller: Spring Boot `AiBridgeService`.
- Browser does **not** call the AI service directly.
- AI is invoked as part of new citizen issue processing.
- No dedicated AI JPA entity is required.
- Prototype uses Gemini where configured, with deterministic fallback behavior.

## 2. Current Architecture

```text
Citizen
  ↓
React frontend
  ↓
Spring Boot IssueController / IssueService
  ↓
AiIntegrationController / AiBridgeService
  ↓
Python FastAPI AI service
  ├─ language handling
  ├─ translation
  ├─ summarization
  ├─ domain classification
  ├─ priority scoring
  ├─ Gemini embeddings
  ├─ FAISS similarity / duplicate detection
  └─ rule-based university routing support
  ↓
Spring Boot persistence / Issue + University data
  ↓
Nodal + University + Analytics workspaces
```

## 3. Implemented Prototype Pipeline

### 3.1 Translation

- Hindi/English input is supported.
- Non-English supported input can be translated to English through the configured Gemini path.
- A deterministic fallback is available when external AI credentials/service access is unavailable.

### 3.2 Summarization

- Generates a concise issue summary through the AI service.
- Output is returned through the backend bridge and can be consumed by the frontend.

### 3.3 Domain Classification

The canonical prototype domain set is:

```text
Education
Agriculture
Healthcare
Water Resources
Environment
Energy
Urban Development
Accessibility
Public Administration
Rural Livelihoods
```

Classification must use these canonical labels and must not silently invent categories.

### 3.4 Priority / Urgency

Prototype priority is rule-based rather than a trained ML prioritization model. Keyword/category signals can produce LOW, MEDIUM, HIGH or CRITICAL severity.

### 3.5 Semantic Deduplication

Implemented prototype flow:

```text
Issue text
  ↓
Gemini text embedding
  ↓
FAISS vector similarity search
  ↓
candidate duplicate
  ↓
similarity / distance result
```

The prototype also supports optional geographic distance using ordinary latitude/longitude values.

### 3.6 University Routing

Routing is deliberately rule-based:

```text
AI domain/category
  ↓
backend category mapping
  ↓
university / department recommendation
```

It is not yet a production multi-factor institutional ranking model.

## 4. AI ↔ Backend Contract

Spring Boot supplies the issue information needed for processing, including issue id, title, description and optional coordinates.

The AI result contract supports:

- translated description where applicable;
- concise summary;
- canonical category/domain;
- priority/urgency result where configured;
- duplicate flag;
- similarity percentage/distance where available;
- matched/candidate issue information where available;
- university-routing recommendation support.

The backend remains responsible for persistence, authorization, routing orchestration and frontend exposure.

## 5. Invocation Rules

AI processing occurs for a new citizen issue submission.

AI is not required for:

- existing issue status updates;
- project/task operations;
- milestone operations;
- Industry/CSR sponsorship operations;
- notifications;
- ordinary dashboard aggregation.

## 6. What Is Complete

- [x] FastAPI AI microservice
- [x] Spring Boot AI bridge
- [x] Gemini integration path
- [x] Hindi/English handling
- [x] summarization
- [x] canonical domain classification
- [x] confidence/result handling
- [x] rule-based prototype priority scoring
- [x] Gemini embeddings
- [x] FAISS semantic similarity
- [x] duplicate detection result handling
- [x] optional lat/long distance support
- [x] category-based university routing
- [x] automatic AI invocation during issue creation
- [x] deterministic fallback path
- [x] AI-focused tests
- [x] CI test workflow
- [x] environment configuration example

## 7. Remaining AI/ML Verification

These are runtime verification tasks, not missing prototype architecture:

- [ ] Configure a real `GEMINI_API_KEY` in the execution/deployment environment.
- [ ] Run live Gemini translation/classification/summarization.
- [ ] Run live Gemini embedding + FAISS duplicate detection.
- [ ] Verify AI results through the deployed Spring Boot → AI service → frontend flow.
- [ ] Confirm fallback behavior after intentionally making the external AI unavailable.

Never commit `GEMINI_API_KEY` to GitHub.

## 8. Environment Contract

AI service configuration is deployment-specific. At minimum, the deployed AI runtime needs the Gemini credential and the backend needs the correct AI service URL.

Typical configuration concept:

```env
GEMINI_API_KEY=<secret outside source control>
AI_SERVICE_URL=<deployed-fastapi-url>
```

The frontend must never receive these private values through `VITE_*` variables.

## 9. Prototype vs Production Boundary

### Prototype — implemented now

- Gemini API
- FastAPI
- FAISS
- plain latitude/longitude
- rule-based priority
- rule-based university routing
- deterministic fallback

### Future / production — do not build unless explicitly requested

- fine-tuned multilingual transformer at scale
- Santhali/Mundari/Ho production-grade language pipeline
- PostGIS spatial clustering
- full multi-factor urgency model
- full institutional skill/ranking model
- continuous retraining/MLOps
- production model monitoring/evaluation infrastructure

## 10. AI/ML Completion Statement

**AI/ML prototype code is complete for the defined SIH scope.** The remaining status is live credential/runtime verification. Do not expand into production-scale AI unless explicitly requested.
