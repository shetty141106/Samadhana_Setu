package com.samadhansetu.dto;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UniversityRoutingResponseDto { private Long universityId; private String universityName; private String universityCode; private String location; private Long departmentId; private String departmentName; private String reason; private int score; }
