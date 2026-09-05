package com.samadhansetu.dto;
import com.samadhansetu.model.enums.MilestoneStatus;
import lombok.*;
import java.time.LocalDate;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MilestoneResponseDto { private Long id; private Long projectId; private String title; private LocalDate startDate; private LocalDate endDate; private MilestoneStatus status; private long taskCount; }
