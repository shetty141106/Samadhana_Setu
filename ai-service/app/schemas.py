from typing import Optional
from pydantic import BaseModel, Field


class IssueCandidate(BaseModel):
    issue_id: int
    title: str = ""
    description: str = ""
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AnalyzeRequest(BaseModel):
    issue_id: Optional[int] = None
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location: Optional[str] = None
    candidates: list[IssueCandidate] = Field(default_factory=list)


class DuplicateMatch(BaseModel):
    found: bool = False
    similarity_percentage: float = 0.0
    candidate_issue_id: Optional[int] = None
    distance_km: Optional[float] = None


class RoutingHints(BaseModel):
    category: str
    discipline_hints: list[str] = Field(default_factory=list)


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
    source: Optional[str] = None
