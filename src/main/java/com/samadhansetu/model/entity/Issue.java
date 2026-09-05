package com.samadhansetu.model.entity;

import com.samadhansetu.model.enums.IssuePriority;
import com.samadhansetu.model.enums.IssueStatus;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Issue {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    @Column(columnDefinition="TEXT") private String description;
    private String location;
    private String latitude;
    private String longitude;
    @Enumerated(EnumType.STRING) private IssueStatus status;
    @Enumerated(EnumType.STRING) private IssuePriority priority;
    @ManyToOne private Citizen reportedBy;
    @OneToMany(mappedBy="issue", cascade=CascadeType.ALL, orphanRemoval=true)
    @Builder.Default private List<EvidenceMedia> evidenceMedia = new ArrayList<>();
}
