package com.samadhansetu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiProcessResponse {
    @JsonProperty("issue_id")
    private Long issueId;
    private String language;
    @JsonProperty("translated_description")
    private String translatedDescription;
    private String summary;
    @JsonProperty("category_tag")
    private String categoryTag;
    private double confidence;
    private String[] keywords;
    private String priority;
    @JsonProperty("priority_score")
    private double priorityScore;
    @JsonProperty("priority_reasons")
    private String[] priorityReasons;
    @JsonProperty("duplicate_match")
    private AiDuplicateMatch duplicateMatch;
    @JsonProperty("matched_university_id")
    private Long matchedUniversityId;
    private String source;

    public boolean isDuplicateFound() {
        return duplicateMatch != null && duplicateMatch.isFound();
    }

    public double getDuplicateSimilarityPercentage() {
        return duplicateMatch == null ? 0.0 : duplicateMatch.getSimilarityPercentage();
    }

    public Long getDuplicateIssueId() {
        return duplicateMatch == null ? null : duplicateMatch.getCandidateIssueId();
    }

    public Double getDuplicateDistanceKm() {
        return duplicateMatch == null ? null : duplicateMatch.getDistanceKm();
    }
}
