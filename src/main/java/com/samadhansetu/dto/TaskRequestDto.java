package com.samadhansetu.dto;
import com.samadhansetu.model.enums.TaskStatus;
import lombok.*;
import java.time.LocalDate;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskRequestDto { private String title; private String description; private LocalDate dueDate; private TaskStatus status; private Long milestoneId; private Long assignedToId; }
