package com.samadhansetu.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiProcessRequest {
    private Long issueId;
    private String title;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    @Builder.Default
    private List<AiIssueCandidate> candidates = new ArrayList<>();
}
