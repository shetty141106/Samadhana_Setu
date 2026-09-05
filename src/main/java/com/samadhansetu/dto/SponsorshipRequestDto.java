package com.samadhansetu.dto;
import lombok.*;
import java.math.BigDecimal;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SponsorshipRequestDto { private Long organizationId; private Long projectId; private BigDecimal amount; private String status; }
