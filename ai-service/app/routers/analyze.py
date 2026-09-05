from fastapi import APIRouter
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.prototype_ai import PrototypeAI

router = APIRouter(prefix="/api/v1")
ai = PrototypeAI()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    response, source = ai.analyze(request)
    response.source = source
    return response
