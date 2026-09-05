package com.samadhansetu.dto;
import lombok.*;
import java.math.BigDecimal;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SponsorshipResponseDto { private Long id; private Long organizationId; private String organizationName; private Long projectId; private String projectTitle; private BigDecimal amount; private String status; }
