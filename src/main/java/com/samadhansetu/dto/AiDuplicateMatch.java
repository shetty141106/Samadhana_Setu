package com.samadhansetu.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiDuplicateMatch {
    private boolean found;
    @JsonProperty("similarity_percentage")
    private double similarityPercentage;
    @JsonProperty("candidate_issue_id")
    private Long candidateIssueId;
    @JsonProperty("distance_km")
    private Double distanceKm;
}
