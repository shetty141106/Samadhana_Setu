package com.samadhansetu.dto;

import com.samadhansetu.model.enums.*;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IssueResponseDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String latitude;
    private String longitude;
    private String category;
    private String district;
    private IssueStatus status;
    private IssuePriority priority;
    private Long citizenId;
    private List<EvidenceMediaDto> evidenceMedia;
    private AiProcessResponse aiAnalysis;
}
