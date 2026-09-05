package com.samadhansetu.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private boolean duplicateFound;
    private double duplicateSimilarityPercentage;
    private Long duplicateIssueId;
    private Double duplicateDistanceKm;
    private Long matchedUniversityId;
    private String source;
}
