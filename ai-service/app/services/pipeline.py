import re
from app.schemas import AnalyzeRequest, AnalyzeResponse, DuplicateMatch, RoutingHints

CATEGORIES = {
    "Education": ["school", "college", "teacher", "student", "education", "विद्यालय", "शिक्षा"],
    "Agriculture": ["crop", "farmer", "farm", "agriculture", "किसान", "फसल", "खेती"],
    "Healthcare": ["hospital", "health", "doctor", "medicine", "clinic", "स्वास्थ्य", "अस्पताल"],
    "Water Resources": ["water", "drinking water", "well", "river", "pipeline", "पानी", "जल"],
    "Environment": ["pollution", "waste", "garbage", "forest", "environment", "प्रदूषण", "कचरा"],
    "Energy": ["electricity", "power", "transformer", "street light", "energy", "बिजली"],
    "Urban Development": ["road", "drainage", "traffic", "sewer", "municipal", "शहरी", "सड़क"],
    "Accessibility": ["wheelchair", "disabled", "ramp", "accessibility", "दिव्यांग"],
    "Public Administration": ["office", "government", "certificate", "public service", "प्रशासन", "सरकार"],
    "Rural Livelihoods": ["livelihood", "self help", "employment", "rural", "handicraft", "रोजगार"],
}

PRIORITY_RULES = [
    ("CRITICAL", ["death", "accident", "unsafe", "contamination", "emergency", "life threatening", "मौत", "दुर्घटना"]),
    ("HIGH", ["three months", "six months", "shortage", "hospital", "drinking water", "no electricity", "danger", "पिछले तीन महीने"]),
    ("MEDIUM", ["frequent", "damaged", "delay", "broken", "blocked", "खराब", "देरी"]),
]


def detect_language(text: str) -> str:
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    return "en"


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip()).strip()


def summarize(text: str) -> str:
    clean = normalize(text)
    sentences = re.split(r"(?<=[.!?।])\s+", clean)
    selected = [s for s in sentences if s][:2]
    result = " ".join(selected)
    return result if result else "No description provided."


def classify(text: str) -> tuple[str, float, list[str]]:
    lowered = text.lower()
    scores: dict[str, int] = {category: 0 for category in CATEGORIES}
    keyword_hits: dict[str, list[str]] = {category: [] for category in CATEGORIES}
    for category, terms in CATEGORIES.items():
        for term in terms:
            if term.lower() in lowered:
                scores[category] += 1
                keyword_hits[category].append(term)
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return "Public Administration", 0.55, []
    confidence = min(0.97, 0.72 + 0.07 * (scores[best] - 1))
    return best, confidence, keyword_hits[best][:8]


def priority(text: str) -> tuple[str, float, list[str]]:
    lowered = text.lower()
    for level, terms in PRIORITY_RULES:
        matches = [term for term in terms if term.lower() in lowered]
        if matches:
            score = {"CRITICAL": 92.0, "HIGH": 78.0, "MEDIUM": 60.0}[level]
            return level, score, [f"keyword signal: {m}" for m in matches[:3]]
    return "LOW", 35.0, ["no high-severity signal detected"]


def analyze_issue(request: AnalyzeRequest) -> AnalyzeResponse:
    raw = normalize(f"{request.title}. {request.description}")
    language = detect_language(raw)
    # Prototype fallback: no external credential is required for local demo.
    translated = request.description if language == "en" else request.description
    summary = summarize(request.description)
    category, confidence, keywords = classify(raw)
    priority_level, priority_score, reasons = priority(raw)
    return AnalyzeResponse(
        issue_id=request.issue_id,
        language=language,
        translated_description=translated,
        summary=summary,
        category_tag=category,
        confidence=confidence,
        keywords=keywords,
        priority=priority_level,
        priority_score=priority_score,
        priority_reasons=reasons,
        duplicate_match=DuplicateMatch(),
        routing=RoutingHints(
            category=category,
            discipline_hints={
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
            }.get(category, [category]),
        ),
    )
