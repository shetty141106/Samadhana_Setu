from app.schemas import AnalyzeRequest, IssueCandidate
from app.services.prototype_ai import PrototypeAI


def test_prototype_pipeline_fallback_preserves_contract(monkeypatch):
    ai = PrototypeAI()
    monkeypatch.setattr(ai.gemini, "analyze", lambda *_: (_ for _ in ()).throw(RuntimeError("offline")))

    response, source = ai.analyze(
        AnalyzeRequest(
            issue_id=2,
            title="Drinking water shortage",
            description="Our village has no drinking water for three months.",
            location="Ranchi",
            candidates=[IssueCandidate(
                issue_id=1,
                title="Drinking water shortage in village",
                description="Village residents have no drinking water",
                location="Ranchi",
            )],
        )
    )

    assert source == "RULE_BASED_FALLBACK"
    assert response.category_tag == "Water Resources"
    assert response.priority == "HIGH"
    assert response.duplicate_match.found is False
