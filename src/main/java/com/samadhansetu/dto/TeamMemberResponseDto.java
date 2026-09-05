package com.samadhansetu.dto;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeamMemberResponseDto { private Long id; private Long projectId; private Long userId; private String userName; private String memberRole; }
