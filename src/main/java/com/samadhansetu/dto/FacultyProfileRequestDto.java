package com.samadhansetu.dto;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FacultyProfileRequestDto { private Long facultyId; private String designation; private String specialization; private String profileUrl; }
