from fastapi import FastAPI
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.pipeline import analyze_issue

app = FastAPI(title="SamadhanSetu AI Service", version="0.1.0")


@app.get("/api/v1/health")
def health() -> dict:
    return {"status": "UP", "service": "samadhansetu-ai"}


@app.post("/api/v1/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    return analyze_issue(request)
