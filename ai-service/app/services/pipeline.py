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


def detect_language(text: str) -> str:
    return "hi" if re.search(r"[\u0900-\u097F]", text) else "en"


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def summarize(text: str) -> str:
    clean = normalize(text)
    sentences = re.split(r"(?<=[.!?।])\s+", clean)
    selected = [s for s in sentences if s][:2]
    result = " ".join(selected)
    return result if result else "No description provided."


def classify(text: str) -> tuple[str, float, list[str]]:
    lowered = text.lower()
    scores = {category: 0 for category in CATEGORIES}
    hits = {category: [] for category in CATEGORIES}
    for category, terms in CATEGORIES.items():
        for term in terms:
            if term.lower() in lowered:
                scores[category] += 1
                hits[category].append(term)
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return "Public Administration", 0.55, []
    return best, min(0.97, 0.72 + 0.07 * (scores[best] - 1)), hits[best][:8]


def priority(text: str) -> tuple[str, float, list[str]]:
    lowered = text.lower()
    rules = [
        ("CRITICAL", ["death", "accident", "unsafe", "contamination", "emergency", "life threatening", "मौत", "दुर्घटना"], 92.0),
        ("HIGH", ["three months", "six months", "shortage", "hospital", "drinking water", "no electricity", "danger", "पिछले तीन महीने"], 78.0),
        ("MEDIUM", ["frequent", "damaged", "delay", "broken", "blocked", "खराब", "देरी"], 60.0),
    ]
    for level, terms, score in rules:
        matches = [term for term in terms if term.lower() in lowered]
        if matches:
            return level, score, [f"keyword signal: {m}" for m in matches[:3]]
    return "LOW", 35.0, ["no high-severity signal detected"]


def analyze_issue(request: AnalyzeRequest) -> AnalyzeResponse:
    raw = normalize(f"{request.title}. {request.description}")
    language = detect_language(raw)
    category, confidence, keywords = classify(raw)
    priority_level, priority_score, reasons = priority(raw)
    return AnalyzeResponse(
        issue_id=request.issue_id,
        language=language,
        translated_description=request.description,
        summary=summarize(request.description),
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
