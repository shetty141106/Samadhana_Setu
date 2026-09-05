import json
import os
from typing import Any

from google import genai
from google.genai import types


class GeminiService:
    """Gemini-backed translation, summarization and domain classification."""

    CATEGORIES = [
        "Education",
        "Agriculture",
        "Healthcare",
        "Water Resources",
        "Environment",
        "Energy",
        "Urban Development",
        "Accessibility",
        "Public Administration",
        "Rural Livelihoods",
    ]

    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.enabled = bool(api_key)
        self.model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
        self.client = genai.Client(api_key=api_key) if self.enabled else None

    def analyze(self, title: str, description: str) -> dict[str, Any]:
        if not self.enabled or self.client is None:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        prompt = f"""
You are the SamadhanSetu civic-issue NLP engine.
Analyze the citizen issue below and return ONLY valid JSON.

Rules:
- Detect language as exactly one of: en, hi.
- If the input is Hindi, translate the description into clear English.
- If the input is English, keep translated_description equal to the original description.
- Produce a concise summary of exactly 1 or 2 sentences.
- Choose exactly one category from this canonical list and never invent a category:
  {json.dumps(self.CATEGORIES)}
- confidence must be a number between 0 and 1.
- keywords must contain the strongest issue terms.

JSON schema:
{{
  "language": "en|hi",
  "translated_description": "string",
  "summary": "string",
  "category_tag": "one canonical category",
  "confidence": 0.0,
  "keywords": ["string"]
}}

Title: {title}
Description: {description}
"""
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                max_output_tokens=500,
                response_mime_type="application/json",
            ),
        )
        text = (response.text or "").strip()
        if not text:
            raise RuntimeError("Gemini returned an empty response")
        parsed = json.loads(text)
        category = parsed.get("category_tag")
        if category not in self.CATEGORIES:
            raise ValueError(f"Gemini returned invalid category: {category}")
        confidence = float(parsed.get("confidence", 0.0))
        parsed["confidence"] = max(0.0, min(1.0, confidence))
        parsed["keywords"] = [str(k) for k in parsed.get("keywords", [])][:8]
        return parsed
