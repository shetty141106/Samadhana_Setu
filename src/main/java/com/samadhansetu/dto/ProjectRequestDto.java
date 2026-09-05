package com.samadhansetu.dto;
import com.samadhansetu.model.enums.ProjectStatus;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectRequestDto { private String title; private String description; private ProjectStatus status; private Long universityId; }
