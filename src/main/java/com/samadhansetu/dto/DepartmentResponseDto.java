package com.samadhansetu.dto;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DepartmentResponseDto { private Long id; private String name; private String code; private Long universityId; private String universityName; }
