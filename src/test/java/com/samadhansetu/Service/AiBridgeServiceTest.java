package com.samadhansetu.Service;

import com.samadhansetu.Repository.IssueRepository;
import com.samadhansetu.dto.AiProcessRequest;
import com.samadhansetu.dto.AiProcessResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiBridgeServiceTest {

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private UniversityRoutingService universityRoutingService;

    @InjectMocks
    private AiBridgeService aiBridgeService;

    @Test
    void process_shouldClassifyHealthcareIssue() {
        when(issueRepository.findAll()).thenReturn(List.of());
        when(universityRoutingService.route("Healthcare")).thenReturn(List.of());

        AiProcessResponse result = aiBridgeService.process(AiProcessRequest.builder()
                .title("Hospital needs medicine")
                .description("The village hospital has no doctor or medicine.")
                .location("Ranchi").build());

        assertEquals("Healthcare", result.getCategory());
        assertTrue(result.getConfidence() > 0.5);
        assertEquals("RULE_BASED_FALLBACK", result.getSource());
        assertNotNull(result.getSummary());
    }

    @Test
    void process_shouldClassifyHindiWaterIssue() {
        when(issueRepository.findAll()).thenReturn(List.of());
        when(universityRoutingService.route("Water Resources")).thenReturn(List.of());

        AiProcessResponse result = aiBridgeService.process(AiProcessRequest.builder()
                .title("पानी की समस्या")
                .description("गांव में पीने का पानी और पाइपलाइन उपलब्ध नहीं है।")
                .location("Dumka").build());

        assertEquals("Water Resources", result.getCategory());
        assertEquals("RULE_BASED_FALLBACK", result.getSource());
    }

    @Test
    void process_shouldDetectSimilarIssue() {
        com.samadhansetu.model.entity.Issue existing = com.samadhansetu.model.entity.Issue.builder()
                .id(42L).title("Broken drinking water pipeline")
                .description("Village drinking water pipeline is broken").build();
        when(issueRepository.findAll()).thenReturn(List.of(existing));
        when(universityRoutingService.route("Water Resources")).thenReturn(List.of());

        AiProcessResponse result = aiBridgeService.process(AiProcessRequest.builder()
                .title("Broken drinking water pipeline")
                .description("Village drinking water pipeline is broken").build());

        assertEquals("Water Resources", result.getCategory());
        assertEquals(42L, result.getDuplicateIssueId());
    }
}
