package com.samadhansetu.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiProcessResponse {
    private Long issueId;
    private String translatedText;
    private String summary;
    private String category;
    private double confidence;
    private Long duplicateIssueId;
    private String source;
    private Long recommendedUniversityId;
    private String recommendedUniversityName;
}
