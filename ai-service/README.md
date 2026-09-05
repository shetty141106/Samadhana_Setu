# SamadhanSetu AI Service

Prototype FastAPI microservice for the SamadhanSetu AI/ML orchestration layer.

## Prototype pipeline

```text
Spring Boot IssueController
        ↓
AiBridgeService
        ↓
FastAPI /api/v1/analyze
        ↓
Gemini NLP
  ├─ Hindi/English detection
  ├─ Hindi → English translation
  ├─ 1–2 sentence summary
  └─ canonical 10-domain classification
        ↓
Rule-based prototype priority
        ↓
Gemini embeddings → FAISS cosine similarity
        ↓
duplicate flag + similarity % + matched issue id + distance
        ↓
Spring Boot category-based university routing
```

This implements the prototype scope in `readme/ai_ml_context.md`. It does **not** add fine-tuned models, PostGIS, production vector infrastructure, MLOps, or multi-factor institutional matching.

## Run

```bash
cd ai-service
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
```

Set the Gemini API key before starting the service:

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="YOUR_KEY"

# Linux/macOS
export GEMINI_API_KEY="YOUR_KEY"
```

Then run:

```bash
uvicorn app.main:app --reload --port 8000
```

The service still has a deterministic fallback if the Gemini API is unavailable. Spring Boot also has a local fallback so the citizen issue workflow does not fail solely because the optional AI service is unavailable.

## Endpoints

- `GET /api/v1/health`
- `POST /api/v1/analyze`

## Example

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "issue_id": 1,
    "title": "पानी की समस्या",
    "description": "हमारे गांव में पिछले तीन महीने से पीने का पानी नहीं है।",
    "location": "Ranchi, Jharkhand",
    "candidates": []
  }'
```

For semantic deduplication, Spring Boot automatically sends existing issue candidates (excluding the current issue) to the AI service. The AI service embeds the new issue and candidates, builds a FAISS inner-product index over normalized vectors, and returns the nearest match when it crosses `AI_DUPLICATE_THRESHOLD`.

## Environment variables

See `.env.example` for the complete prototype configuration.
