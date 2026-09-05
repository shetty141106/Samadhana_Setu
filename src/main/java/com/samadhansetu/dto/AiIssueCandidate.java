package com.samadhansetu.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiIssueCandidate {
    private Long issueId;
    private String title;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
}
