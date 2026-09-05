package com.samadhansetu.model.entity;

import com.samadhansetu.model.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String title;
    @Column(columnDefinition="TEXT") private String description;
    @Enumerated(EnumType.STRING) private ProjectStatus status;
    @ManyToOne private University university;
    @OneToMany(mappedBy="project", cascade=CascadeType.ALL) @Builder.Default
    private List<TeamMember> teamMembers = new ArrayList<>();
    @OneToMany(mappedBy="project", cascade=CascadeType.ALL) @Builder.Default
    private List<Milestone> milestones = new ArrayList<>();
}
