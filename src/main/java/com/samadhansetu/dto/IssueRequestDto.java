package com.samadhansetu.dto;

import com.samadhansetu.model.enums.IssuePriority;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IssueRequestDto {
    private String title;
    private String description;
    private String location;
    private String latitude;
    private String longitude;
    private IssuePriority priority;
    private List<EvidenceMediaDto> evidenceMedia;
}
