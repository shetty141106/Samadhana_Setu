package com.samadhansetu.model.entity;

import com.samadhansetu.model.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="project_id", nullable=false) private Project project;
    @ManyToOne @JoinColumn(name="milestone_id") private Milestone milestone;
    @ManyToOne @JoinColumn(name="assigned_to") private User assignedTo;
    @Column(nullable=false) private String title;
    @Column(columnDefinition="TEXT") private String description;
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING) private TaskStatus status;
}
