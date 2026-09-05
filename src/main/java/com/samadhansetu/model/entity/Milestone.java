package com.samadhansetu.model.entity;

import com.samadhansetu.model.enums.MilestoneStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Milestone {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="project_id", nullable=false) private Project project;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING) private MilestoneStatus status;
}
