from app.schemas import AnalyzeRequest, AnalyzeResponse, DuplicateMatch, RoutingHints
from app.services.deduplication import FaissDeduplicator
from app.services.gemini_service import GeminiService
from app.services.pipeline import classify, detect_language, normalize, priority, summarize


class PrototypeAI:
    """Orchestrates the complete prototype AI pipeline."""

    def __init__(self) -> None:
        self.gemini = GeminiService()
        self.deduplicator = FaissDeduplicator()

    def analyze(self, request: AnalyzeRequest) -> tuple[AnalyzeResponse, str]:
        raw = normalize(f"{request.title}. {request.description}")

        try:
            nlp = self.gemini.analyze(request.title, request.description)
        except Exception:
            category, confidence, keywords = classify(raw)
            nlp = {
                "language": detect_language(raw),
                "translated_description": request.description,
                "summary": summarize(request.description),
                "category_tag": category,
                "confidence": confidence,
                "keywords": keywords,
            }
            source = "RULE_BASED_FALLBACK"
        else:
            source = "GEMINI"

        priority_level, priority_score, reasons = priority(
            f"{nlp['translated_description']} {request.description}"
        )

        duplicate = DuplicateMatch()
        if request.candidates:
            try:
                match = self.deduplicator.find_match(
                    nlp["translated_description"],
                    [candidate.model_dump() for candidate in request.candidates],
                    request.latitude,
                    request.longitude,
                )
                duplicate = DuplicateMatch(**match)
                if duplicate.found:
                    source = f"{source}+FAISS"
            except Exception:
                # Spring Boot retains its deterministic fallback if vector services
                # are unavailable, so the citizen flow remains operational.
                pass

        category = nlp["category_tag"]
        discipline_hints = {
            "Water Resources": ["Civil Engineering", "Environmental Engineering"],
            "Education": ["Education", "Computer Science"],
            "Agriculture": ["Agricultural Engineering", "Agriculture"],
            "Healthcare": ["Medicine", "Nursing", "Pharmacy"],
            "Environment": ["Environmental Engineering", "Environmental Science"],
            "Energy": ["Electrical Engineering", "Mechanical Engineering"],
            "Urban Development": ["Civil Engineering", "Architecture", "Urban Planning"],
            "Accessibility": ["Civil Engineering", "Computer Science", "Mechanical Engineering"],
            "Public Administration": ["Public Administration", "Management", "Social Science"],
            "Rural Livelihoods": ["Rural Development", "Economics", "Agriculture"],
        }
        response = AnalyzeResponse(
            issue_id=request.issue_id,
            language=nlp["language"],
            translated_description=nlp["translated_description"],
            summary=nlp["summary"],
            category_tag=category,
            confidence=nlp["confidence"],
            keywords=nlp["keywords"],
            priority=priority_level,
            priority_score=priority_score,
            priority_reasons=reasons,
            duplicate_match=duplicate,
            routing=RoutingHints(category=category, discipline_hints=discipline_hints.get(category, [category])),
        )
        return response, source
