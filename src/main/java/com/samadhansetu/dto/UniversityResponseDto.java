package com.samadhansetu.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UniversityResponseDto {

    private Long id;
    private String name;
    private String code;
    private String location;
}
