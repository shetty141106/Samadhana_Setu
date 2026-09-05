package com.samadhansetu.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(unique = true, length = 30)
    private String cin;

    @Column(unique = true, length = 30)
    private String gstin;

    @Column(unique = true, length = 30)
    private String udyamNumber;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 500)
    private String website;

    @Builder.Default
    @Column(nullable = false)
    private Boolean verified = false;
}