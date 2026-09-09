# SAMADHANSETU — AI/ML LAYER CONTEXT

> **AI/ML implementation source of truth for the current SIH prototype.** Reconciled against the current repository implementation on `main`. This file documents what is actually implemented, what is fallback behavior, and what still requires runtime verification.

## 1. Scope

- Service: standalone Python FastAPI microservice.
- Caller: Spring Boot `AiBridgeService`.
- Browser does **not** call the AI service directly.
- AI processing is invoked during new citizen issue creation.
- Spring Boot remains responsible for persistence and API exposure.
- Gemini is optional at runtime because the backend has deterministic fallback processing.

## 2. Current Architecture

```text
Citizen
  ↓
React frontend
  ↓
Spring Boot IssueController / IssueService
  ↓
AiBridgeService
  ↓
Python FastAPI AI service
  ├─ language handling
  ├─ translation
  ├─ summarization
  ├─ domain classification
  ├─ priority scoring
  ├─ Gemini embeddings
  ├─ FAISS similarity / duplicate detection
  └─ AI processing contract
  ↓
Spring Boot
  ├─ apply category/priority
  ├─ persist AiAnalysis
  └─ UniversityRoutingService
  ↓
Nodal / academic / admin workspaces
```

## 3. Implemented Prototype Pipeline

### 3.1 Translation

Hindi/English handling exists in the AI contract. Live external translation depends on the configured FastAPI/Gemini path; backend fallback preserves a usable result when external AI is unavailable.

### 3.2 Summarization

The AI response contains a concise summary. The deterministic backend fallback uses a bounded description summary when external AI processing is unavailable.

### 3.3 Domain Classification

Canonical prototype domains are:

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

The fallback classifier uses deterministic keyword rules and defaults to `Public Administration` when no stronger rule matches.

### 3.4 Priority / Urgency

Prototype priority is rule-based, not a trained ML severity model. The result is one of:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

The backend entity uses the `IssuePriority` enum. Frontend human-readable values must be normalized before being sent to the backend.

### 3.5 Semantic Deduplication

The AI service path supports Gemini embeddings and FAISS similarity. The Spring Boot bridge also contains a deterministic local token/Jaccard fallback for duplicate detection when the external AI call is unavailable.

Current fallback behavior:

```text
Issue title + description
  ↓
normalize/tokenize
  ↓
Jaccard similarity against up to 500 candidates
  ↓
duplicate result when similarity threshold is reached
```

### 3.6 University Routing

Routing is performed in Spring Boot after AI category enrichment:

```text
AI category
  ↓
UniversityRoutingService
  ↓
configured category terms
  ↓
Department names
  ↓
University recommendation
```

This is a deterministic prototype heuristic. It is not a production institutional ranking model.

## 4. AI ↔ Backend Contract

Spring Boot sends issue id, title, description, location and optional latitude/longitude to the AI processing contract. It can also send candidate issues for duplicate comparison.

The structured result supports:

- language
- translated description
- summary
- canonical category
- confidence
- keywords
- priority
- priority score/reasons
- duplicate match
- matched university ID
- source

Spring Boot then applies the returned category/priority to the issue and persists an `AiAnalysis` record.

## 5. Invocation and Failure Behavior

AI processing is called from `IssueService.create()` after the issue is saved. `AiBridgeService` attempts the configured FastAPI endpoint.

If the external call throws or returns no usable response:

```text
FastAPI/Gemini unavailable
        ↓
Spring Boot deterministic fallback
        ↓
category + priority + summary + duplicate result
        ↓
AI analysis persistence
```

This makes the prototype more resilient, but issue creation and AI processing are currently coupled in the same service transaction. Asynchronous AI processing can be considered later if runtime reliability requires it.

## 6. What Is Implemented

- [x] FastAPI AI service integration path
- [x] Spring Boot AI bridge
- [x] Gemini integration path
- [x] Hindi/English handling
- [x] summarization contract
- [x] canonical domain classification
- [x] confidence/result handling
- [x] prototype priority scoring
- [x] Gemini embedding path
- [x] FAISS semantic similarity path
- [x] duplicate detection result handling
- [x] optional latitude/longitude distance data
- [x] deterministic university routing support
- [x] automatic AI invocation during issue creation
- [x] deterministic backend fallback
- [x] AI-related test coverage present in repository

## 7. Remaining AI/ML Verification

- [ ] Verify deployed FastAPI endpoint from Spring Boot.
- [ ] Configure/verify a real `GEMINI_API_KEY` in the AI runtime.
- [ ] Verify live Gemini translation/classification/summarization.
- [ ] Verify live embedding + FAISS behavior against real records.
- [ ] Verify AI result reaches the frontend after a real issue submission.
- [ ] Verify fallback behavior by making the external AI unavailable.

Never commit `GEMINI_API_KEY`.

## 8. Environment Contract

Backend:

```env
AI_SERVICE_URL=<deployed-fastapi-url>
```

AI service:

```env
GEMINI_API_KEY=<secret outside source control>
```

The frontend must never receive these private values through `VITE_*` variables.

## 9. Prototype vs Production Boundary

### Prototype — implemented/current

- FastAPI
- Gemini integration path
- FAISS similarity
- ordinary latitude/longitude
- rule-based priority fallback
- deterministic university routing
- backend AI fallback

### Future / production — do not build unless explicitly requested

- production-scale multilingual transformer pipeline
- Santhali/Mundari/Ho production language models
- PostGIS spatial clustering
- trained multi-factor urgency model
- learned institutional skill/ranking model
- continuous retraining/MLOps
- production model monitoring/evaluation infrastructure

## 10. Completion Statement

**AI/ML prototype architecture is substantially implemented.** Full completion still requires live FastAPI/Gemini verification and verification of the complete deployed issue → AI → routing flow.
