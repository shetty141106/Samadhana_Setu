package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Organization {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    private String cin;
    private String gstin;
    private String udyam;
    private String address;
    private String website;
}
