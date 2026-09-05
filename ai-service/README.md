# SamadhanSetu AI Service

Prototype FastAPI microservice for the SamadhanSetu AI/ML orchestration layer.

## Run

```bash
cd ai-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET /api/v1/health`
- `POST /api/v1/analyze`

The prototype intentionally uses deterministic local processing so the service can run without API credentials. The pipeline contract is provider-independent and follows `readme/ai_ml_context.md`. Gemini/IndicBERT and FAISS can be plugged into the provider interfaces in a later iteration without changing the Spring Boot-facing contract.

## Example

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"issue_id":1,"title":"Drinking water shortage","description":"Our village has no drinking water for three months.","location":"Ranchi, Jharkhand"}'
```
