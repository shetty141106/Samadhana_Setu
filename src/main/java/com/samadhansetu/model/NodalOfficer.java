package com.samadhansetu.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nodal_officers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NodalOfficer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 120)
    private String departmentName;

    @Column(length = 100)
    private String designation;

    @Column(length = 120)
    private String jurisdiction;
}