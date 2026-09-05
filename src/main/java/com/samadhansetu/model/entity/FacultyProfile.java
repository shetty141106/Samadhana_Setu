package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FacultyProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="faculty_id", nullable=false, unique=true) private Faculty faculty;
    private String designation;
    private String specialization;
    private String profileUrl;
}
