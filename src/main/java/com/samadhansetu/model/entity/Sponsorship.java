package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Sponsorship {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="organization_id", nullable=false) private Organization organization;
    @ManyToOne @JoinColumn(name="project_id", nullable=false) private Project project;
    private BigDecimal amount;
    private String status;
}
