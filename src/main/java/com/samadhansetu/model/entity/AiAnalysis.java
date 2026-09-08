package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @Builder.Default
    private LocalDateTime ranAt = LocalDateTime.now();

    private String source;
    private String language;

    @Column(columnDefinition = "TEXT")
    private String translatedDescription;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String categoryTag;
    private Double confidence;

    @ElementCollection
    @CollectionTable(name = "ai_analysis_keywords", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "keyword")
    @Builder.Default
    private List<String> keywords = new ArrayList<>();

    private String priority;
    private Double priorityScore;

    @ElementCollection
    @CollectionTable(name = "ai_analysis_priority_reasons", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "reason")
    @Builder.Default
    private List<String> priorityReasons = new ArrayList<>();

    private Boolean duplicateFound;
    private Double duplicateSimilarity;
    private Long duplicateIssueId;
    private Double duplicateDistanceKm;
    private Long matchedUniversityId;
}
