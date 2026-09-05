from app.schemas import AnalyzeRequest
from app.services.pipeline import analyze_issue


def test_water_issue_is_classified_and_prioritized():
    result = analyze_issue(AnalyzeRequest(
        issue_id=1,
        title="Drinking water shortage",
        description="Our village has no drinking water for three months.",
        location="Ranchi, Jharkhand",
    ))
    assert result.category_tag == "Water Resources"
    assert result.priority == "HIGH"
    assert result.language == "en"


def test_hindi_issue_detects_hindi():
    result = analyze_issue(AnalyzeRequest(
        title="पानी की समस्या",
        description="हमारे गांव में पीने का पानी नहीं है।",
    ))
    assert result.language == "hi"
    assert result.category_tag == "Water Resources"
