package com.samadhansetu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiProcessResponse {
    private Long issueId;
    private String language;
    private String translatedDescription;
    private String summary;
    private String categoryTag;
    private double confidence;
    private String[] keywords;
    private String priority;
    private double priorityScore;
    private String[] priorityReasons;
    private AiDuplicateMatch duplicateMatch;
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
