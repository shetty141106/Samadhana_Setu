package com.samadhansetu.dto;
import com.samadhansetu.model.enums.ProjectStatus;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectResponseDto { private Long id; private String title; private String description; private ProjectStatus status; private Long universityId; private String universityName; private long teamSize; private long milestoneCount; private long taskCount; }
