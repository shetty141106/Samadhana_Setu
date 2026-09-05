package com.samadhansetu.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationResponseDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private boolean readStatus;
    private LocalDateTime createdAt;
}
