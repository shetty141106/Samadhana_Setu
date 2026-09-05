import math
import os
from typing import Any

import faiss
import numpy as np
from google import genai
from google.genai import types


class FaissDeduplicator:
    """Prototype semantic deduplication using Gemini embeddings + FAISS."""

    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.enabled = bool(api_key)
        self.embedding_model = os.getenv("GEMINI_EMBEDDING_MODEL", "gemini-embedding-2")
        self.dimension = int(os.getenv("GEMINI_EMBEDDING_DIMENSION", "768"))
        self.threshold = float(os.getenv("AI_DUPLICATE_THRESHOLD", "0.78"))
        self.client = genai.Client(api_key=api_key) if self.enabled else None

    def _embed(self, texts: list[str]) -> np.ndarray:
        if not self.enabled or self.client is None:
            raise RuntimeError("GEMINI_API_KEY is not configured")
        result = self.client.models.embed_content(
            model=self.embedding_model,
            contents=texts,
            config=types.EmbedContentConfig(output_dimensionality=self.dimension),
        )
        vectors = np.asarray([item.values for item in result.embeddings], dtype="float32")
        faiss.normalize_L2(vectors)
        return vectors

    @staticmethod
    def _distance_km(a_lat: float | None, a_lon: float | None,
                     b_lat: float | None, b_lon: float | None) -> float | None:
        if None in (a_lat, a_lon, b_lat, b_lon):
            return None
        radius = 6371.0
        lat1, lat2 = math.radians(a_lat), math.radians(b_lat)
        dlat = math.radians(b_lat - a_lat)
        dlon = math.radians(b_lon - a_lon)
        h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        return radius * 2 * math.asin(math.sqrt(h))

    def find_match(self, query_text: str, candidates: list[dict[str, Any]],
                   latitude: float | None, longitude: float | None) -> dict[str, Any]:
        if not candidates:
            return {"found": False, "similarity_percentage": 0.0}

        texts = [
            f"{c.get('title', '')}. {c.get('description', '')}. {c.get('location', '')}"
            for c in candidates
        ]
        vectors = self._embed([query_text] + texts)
        query_vector = vectors[:1]
        candidate_vectors = vectors[1:]

        index = faiss.IndexFlatIP(candidate_vectors.shape[1])
        index.add(candidate_vectors)
        similarities, indices = index.search(query_vector, min(1, len(candidates)))
        similarity = float(similarities[0][0])
        candidate_index = int(indices[0][0])
        candidate = candidates[candidate_index]
        percentage = max(0.0, min(100.0, similarity * 100.0))
        if similarity < self.threshold:
            return {"found": False, "similarity_percentage": round(percentage, 2)}

        return {
            "found": True,
            "similarity_percentage": round(percentage, 2),
            "candidate_issue_id": candidate.get("issue_id"),
            "distance_km": self._distance_km(
                latitude, longitude, candidate.get("latitude"), candidate.get("longitude")
            ),
        }
