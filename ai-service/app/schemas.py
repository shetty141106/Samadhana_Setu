from typing import Optional
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    issue_id: Optional[int] = None
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location: Optional[str] = None


class DuplicateMatch(BaseModel):
    found: bool = False
    similarity_percentage: float = 0.0
    candidate_issue_id: Optional[int] = None
    distance_km: Optional[float] = None


class RoutingHints(BaseModel):
    category: str
    discipline_hints: list[str] = []


class AnalyzeResponse(BaseModel):
    issue_id: Optional[int] = None
    language: str
    translated_description: str
    summary: str
    category_tag: str
    confidence: float
    keywords: list[str]
    priority: str
    priority_score: float
    priority_reasons: list[str]
    duplicate_match: DuplicateMatch
    matched_university_id: Optional[int] = None
    routing: RoutingHints
