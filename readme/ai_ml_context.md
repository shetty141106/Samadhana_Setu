# SAMADHANSETU — AI/ML LAYER CONTEXT (PROTOTYPE SCOPE)

> **Purpose of this file**: This is the AI/ML implementation-layer ground truth for SamadhanSetu — what AI actually does, where it sits in the pipeline, when it's invoked, and the exact tech stack to build **at this stage (hackathon/prototype)**. This file deliberately follows the **MVP/prototype scope** (`PROJECT_CONTEXT.md` Section 4.3), NOT the full production vision (`PROJECT_CONTEXT.md` Section 3.2) — the production-scale stack is included only as a clearly-marked "Future / Not Now" appendix so an agent never accidentally over-builds. Written for AI-agent consumption, not human reading.

---

## 1. METADATA

- `layer_name`: AI/ML Orchestration Layer
- `scope_mode`: PROTOTYPE (hackathon MVP) — do not build production-scale stack unless explicitly instructed
- `relationship_to_other_context_files`:
  - `PROJECT_CONTEXT.md` → defines *why* AI is needed and the full production vision (Sections 3.2, 4.3, Differentiator D)
  - `samadhansetu_backend_context.md` → defines the Spring Boot module (`Module 3 — AI Orchestration`: `AiIntegrationController`, `AiBridgeService`) that this AI layer talks to
  - This file → defines *what the AI service itself does*, its exact stack, and the contract between it and the backend
- `service_type`: standalone Python microservice, invoked by Spring Boot backend via webhook/API call — NOT a JPA entity, NOT part of the Spring Boot codebase itself

---

## 2. WHERE AI SITS IN THE OVERALL ARCHITECTURE

```
[Citizen] → [React Web Frontend] → [Spring Boot: IssueController → IssueService → IssueRepository]
                                              │
                                              │  (on new Issue submission)
                                              ▼
                              [Spring Boot: AiIntegrationController → AiBridgeService]
                                              │
                                              │  webhook / REST call
                                              ▼
                              [Python FastAPI AI Service]  ← THIS FILE covers this box
                                              │
                              (classify, translate, deduplicate, prioritize, route)
                                              │
                                              ▼
                     results written back via AiBridgeService → IssueRepository / UniversityRepository
                                              │
                                              ▼
                         [University Nodal Workspace] + [Analytics Dashboard] consume results
```

- AI has **no dedicated JPA entity** (confirmed in `samadhansetu_backend_context.md` Section 2.1) — it reads/writes via `IssueRepository` and `UniversityRepository` fields, through DTOs passed over the webhook.
- Trigger point: **on new `Issue` submission** (Citizen Ingestion module) — this is the only entry point for the AI pipeline at prototype stage.

---

## 3. WHEN AI IS INVOKED (Prototype Scope)

| Trigger | AI Action Performed | Consumer of Output |
|---|---|---|
| Citizen submits a new Issue (title + description, any supported language) | Translate (if non-English) → Summarize → Classify into domain tag | Issue record (status field), University Nodal Workspace |
| Same submission event | Check submitted issue against existing Issue DB entries for similarity | Citizen-facing "Similar issue detected" surfacing; Analytics dashboard dedup count |
| Same submission event, after classification | Rule-based lookup: matched domain tag → matching University in DB | `AiIntegrationController` writes assignment back to Issue/University link |

- At prototype stage, **all three AI actions fire synchronously (or near-synchronously) in a single pipeline run per submission** — there is no separate scheduled/batch AI job, no continuous retraining, no human-in-the-loop review step yet.
- AI is NOT invoked for: existing-issue status updates, project/task management, industry/CSR matching, notifications — none of these touch the AI service at prototype stage.

---

## 4. WHAT AI DOES — PIPELINE STEPS (Prototype Scope, from `PROJECT_CONTEXT.md` Section 4.3)

### 4.1 Step 1 — Translation & Summarization & Classification
- Input: raw citizen-submitted `title` + `description` (Hindi/vernacular text allowed as-is).
- Process:
  1. If input is non-English, translate to English.
  2. Auto-generate a 2-sentence summary of the issue.
  3. Auto-assign a category tag from the canonical domain list (see Section 6).
- Model choice (prototype): **IndicBERT or Gemini API** — either is acceptable for the hackathon build; Gemini API is the faster integration path if time-constrained, IndicBERT if a fully open-source/offline-capable stack is preferred.

### 4.2 Step 2 — Deduplication (Mocked/Simplified for Prototype)
- Process: vector distance check against existing DB entries using **FAISS or Pinecone**.
- Output surfaced to citizen/admin: a similarity flag with a percentage match and rough distance, e.g. *"Similar issue detected 2km away (85% match)."*
- Explicitly a **mock/simplified version** of the full production Semantic Deduplication Engine — no spatial clustering (PostGIS) layered in yet at this stage, just vector similarity.

### 4.3 Step 3 — Auto-Routing (Rule-Based, Not ML-Based, at Prototype Stage)
- Process: **rule-based lookup**, not a trained matching model.
  1. Read the assigned category tag from Step 1 (e.g. "Water Resources").
  2. Look up a matching university in the DB whose registered discipline/department matches that tag (e.g. BIT Mesra – Civil/Environmental Dept).
- Explicitly simplified vs. the full production **Automated Institutional Routing System** (which factors faculty specialization, lab capability, NIRF/NAAC ratings, incubation facilities — see Section 8 for that full-scope version, deferred).

---

## 5. PROTOTYPE TECH STACK (Build This Now)

| Layer | Choice | Notes |
|---|---|---|
| Service framework | Python + **FastAPI** | Exposes REST endpoint(s) consumed by Spring Boot's `AiBridgeService` via webhook |
| NLP / classification / translation | **IndicBERT** (open-source, AI4Bharat) OR **Gemini API** | Either acceptable for prototype; pick based on time constraint (Gemini = faster to integrate, IndicBERT = fully open-source/offline-capable) |
| Deduplication / vector similarity | **FAISS** or **Pinecone** | Vector distance check against existing issue embeddings; FAISS if fully self-hosted/offline preferred, Pinecone if managed vector DB preferred |
| Routing logic | **Rule-based lookup** (plain Python conditional/dict-mapping logic against university DB records) | NOT a trained ML matching model at this stage |
| Geospatial | Plain lat/long strings (matches `samadhansetu_backend_context.md` Section 3's `Issue.java` — no PostGIS at prototype stage) | Deferred: real spatial clustering |
| Communication with backend | Webhook / REST call, request-response, synchronous | Matches `AiIntegrationController → AiBridgeService` contract in backend context file |

### 5.1 Explicitly Deferred/Skipped at Prototype Stage
- No fine-tuned Llama-3 model — use pretrained IndicBERT or Gemini API as-is, no custom fine-tuning pass.
- No PostGIS-based spatial clustering — plain lat/long distance only, if distance is computed at all.
- No multi-factor prioritization/urgency ML model — if a priority field is set, do it via simple rule (e.g. category + keyword flags), not a trained model.
- No multi-factor institutional routing (NIRF/NAAC, lab capability, faculty specialization matching) — plain category-tag-to-department lookup only.
- No continuous/batch retraining pipeline, no MLOps tooling, no model monitoring dashboard.

---

## 6. CANONICAL DOMAIN CLASSIFICATION LIST (use exactly, do not invent new categories)

```
Education, Agriculture, Healthcare, Water Resources, Environment,
Energy, Urban Development, Accessibility, Public Administration, Rural Livelihoods
```

## 6.1 Canonical Supported Languages (prototype scope — translation input)

```
Hindi, English
```
- Note: full vision (`PROJECT_CONTEXT.md` Section 2.1/9) also names Santhali, Mundari, Ho as target languages — these are **not required for the prototype AI pipeline**; only Hindi↔English translation needs to actually work for the hackathon demo. Treat Santhali/Mundari/Ho support as a stated future direction, not a prototype build requirement, unless explicitly instructed otherwise.

---

## 7. INTEGRATION CONTRACT WITH BACKEND (what the AI service must return)

Based on `samadhansetu_backend_context.md` Module 3 spec (`AiIntegrationController → AiBridgeService`, no dedicated entity, uses `IssueRepository` & `UniversityRepository`):

- **Input to AI service** (from Spring Boot, on new Issue submission): `issue_id`, `title`, `description`, (optionally `latitude`/`longitude` if similarity-by-location is attempted).
- **Output expected back from AI service** (consumed by `AiBridgeService`, written into `Issue`/routing fields):
  - `translated_description` (if translation occurred)
  - `summary` (2-sentence auto-summary)
  - `category_tag` (one value from the canonical domain list in Section 6)
  - `duplicate_match` (boolean/flag + optional similarity percentage + optional reference to matched `issue_id`)
  - `matched_university_id` (or null if no rule-based match found)
- This is a DTO-level contract — no dedicated AI entity exists on the Spring Boot side to persist this; fields land on `Issue` (or a lightweight linking mechanism) per backend context Section 2.1.

---

## 8. FUTURE / NOT NOW — FULL PRODUCTION AI VISION (do not build unless explicitly asked)

> Everything below is sourced from `PROJECT_CONTEXT.md` Section 3.2 (full production architecture). It is included here **only for context/roadmap awareness** — the prototype must follow Sections 4–7 above, not this section.

- Automated Multilingual NLP Classification: fine-tuned transformer (IndicBERT / **Llama-3-fine-tuned**) across all 10 domains, full vernacular set (Hindi, Santhali, Mundari, Ho, English).
- Semantic Deduplication Engine: vector DB (Pinecone/FAISS) + sentence-embeddings + **PostGIS spatial clustering** combined — not just vector similarity alone.
- Prioritization & Urgency Matrix: full ML model factoring geographic spread, citizen votes, historical sector urgency, public safety impact (and per the literature review, extendable to affected population, vulnerability, environmental/social impact).
- Automated Institutional Routing System: full matching algorithm indexing complete university skill matrices — faculty specialization, lab capability, **NIRF/NAAC ratings**, incubation facility availability — not just a category-tag lookup.
- Recommended tech stack additions at production scale: PostgreSQL + PostGIS (upgrade from prototype's plain lat/long), full Bhuvan/OpenStreetMap GIS layer integration.

---

## 9. USAGE NOTES FOR AI AGENTS

- Default to **prototype scope (Sections 3–7)** for any code-generation, architecture, or "what should the AI service do" question — never silently pull in Section 8's production stack.
- If asked to "improve" or "make more accurate" the AI pipeline without an explicit request for production scale, first ask/clarify whether the ask is still within prototype/hackathon scope or now targets Section 8's production vision — do not assume escalation.
- The canonical domain list (Section 6) and the DTO contract (Section 7) are the two most load-bearing pieces of this file — any AI service code must emit fields matching Section 7's contract exactly, and only use tags from Section 6's list.
- Cross-check `samadhansetu_backend_context.md` Section 2 (Module 3 row) before changing the webhook contract — the Spring Boot side (`AiIntegrationController`/`AiBridgeService`) expects the shape defined in Section 7 here.
- This file does not cover: model training pipelines, MLOps, data labeling processes, or evaluation metrics — none of these are defined yet at prototype stage; do not invent them if asked, flag them as undefined instead.
