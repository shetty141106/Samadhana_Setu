package com.samadhansetu.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiDuplicateMatch {
    private boolean found;
    private double similarityPercentage;
    private Long candidateIssueId;
    private Double distanceKm;
}
