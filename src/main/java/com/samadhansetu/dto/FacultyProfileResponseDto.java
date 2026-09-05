package com.samadhansetu.dto;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FacultyProfileResponseDto { private Long id; private Long facultyId; private Long userId; private String facultyName; private Long universityId; private Long departmentId; private String designation; private String specialization; private String profileUrl; }
