package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class University {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    private String code;
    private String location;
    @OneToMany(mappedBy="university") @Builder.Default
    private List<Department> departments = new ArrayList<>();
}
