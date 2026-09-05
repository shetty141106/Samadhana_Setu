import numpy as np

from app.services.deduplication import FaissDeduplicator


def test_faiss_duplicate_match_returns_similarity(monkeypatch):
    service = FaissDeduplicator()

    def fake_embed(texts):
        vectors = np.array(
            [
                [1.0, 0.0],
                [0.99, 0.01],
                [0.0, 1.0],
            ],
            dtype="float32",
        )
        import faiss
        faiss.normalize_L2(vectors)
        return vectors

    monkeypatch.setattr(service, "_embed", fake_embed)
    result = service.find_match(
        "large pothole near college gate",
        [
            {
                "issue_id": 10,
                "title": "Pothole near college",
                "description": "Large pothole is causing traffic problems",
                "location": "Navi Mumbai",
                "latitude": 19.033,
                "longitude": 73.0297,
            },
            {
                "issue_id": 11,
                "title": "Broken street light",
                "description": "Street light is not working",
                "location": "Navi Mumbai",
                "latitude": 19.04,
                "longitude": 73.02,
            },
        ],
        19.033,
        73.0297,
    )

    assert result["found"] is True
    assert result["candidate_issue_id"] == 10
    assert result["similarity_percentage"] > 99
    assert result["distance_km"] == 0
