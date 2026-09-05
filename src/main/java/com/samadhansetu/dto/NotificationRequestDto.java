package com.samadhansetu.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationRequestDto {
    private Long userId;
    private String title;
    private String message;
}
