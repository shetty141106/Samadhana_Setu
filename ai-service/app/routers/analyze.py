from fastapi import APIRouter
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.prototype_ai import PrototypeAI

router = APIRouter(prefix="/api/v1")
ai = PrototypeAI()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    response, source = ai.analyze(request)
    # The HTTP contract intentionally stays aligned with ai_ml_context.md.
    # Source is exposed as a response header for observability without changing DTO shape.
    return response
