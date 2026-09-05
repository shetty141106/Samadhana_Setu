from fastapi import APIRouter
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.pipeline import analyze_issue

router = APIRouter(prefix="/api/v1")


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    return analyze_issue(request)
