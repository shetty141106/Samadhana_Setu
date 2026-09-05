package com.samadhansetu.model;

import com.samadhansetu.model.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String domain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id")
    private University university;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 500)
    private String repositoryUrl;

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<TeamMember> teamMembers = new ArrayList<>();

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<Milestone> milestones = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
}