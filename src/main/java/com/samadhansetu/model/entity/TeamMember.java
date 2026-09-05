package com.samadhansetu.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeamMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="project_id", nullable=false) private Project project;
    @ManyToOne @JoinColumn(name="user_id", nullable=false) private User user;
    private String memberRole;
}
