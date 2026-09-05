package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Industry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="user_id", nullable=false, unique=true) private User user;
    @ManyToOne private Organization organization;
}
