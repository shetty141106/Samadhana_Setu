package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    private String code;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="university_id", nullable=false) private University university;
}
