package com.samadhansetu.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminUserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String role;
}
