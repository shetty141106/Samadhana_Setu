package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EvidenceMedia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="issue_id", nullable=false) private Issue issue;
    private String mediaUrl;
    private String mediaType;
}
