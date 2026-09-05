package com.samadhansetu.dto;

import com.samadhansetu.model.enums.IssuePriority;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String location;
    private String latitude;
    private String longitude;
    private IssuePriority priority;
    private List<EvidenceMediaDto> evidenceMedia;
}
