package com.samadhansetu.Service;

import com.samadhansetu.Repository.IssueRepository;
import com.samadhansetu.dto.AiIssueCandidate;
import com.samadhansetu.dto.AiProcessRequest;
import com.samadhansetu.dto.AiProcessResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

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
        AiProcessResponse result = aiBridgeService.process(AiProcessRequest.builder()
                .title("Hospital needs medicine")
                .description("The village hospital has no doctor or medicine.")
                .location("Ranchi").build());

        assertEquals("Healthcare", result.getCategoryTag());
        assertTrue(result.getConfidence() > 0.5);
        assertEquals("RULE_BASED_FALLBACK", result.getSource());
        assertNotNull(result.getSummary());
    }

    @Test
    void process_shouldClassifyHindiWaterIssue() {
        AiProcessResponse result = aiBridgeService.process(AiProcessRequest.builder()
                .title("पानी की समस्या")
                .description("गांव में पीने का पानी और पाइपलाइन उपलब्ध नहीं है।")
                .location("Dumka").build());

        assertEquals("Water Resources", result.getCategoryTag());
        assertEquals("RULE_BASED_FALLBACK", result.getSource());
    }

    @Test
    void process_shouldDetectSimilarIssue() {
        AiIssueCandidate existing = AiIssueCandidate.builder()
                .issueId(42L)
                .title("Broken drinking water pipeline")
                .description("Village drinking water pipeline is broken")
                .build();

        AiProcessResponse result = aiBridgeService.process(AiProcessRequest.builder()
                .title("Broken drinking water pipeline")
                .description("Village drinking water pipeline is broken")
                .candidates(List.of(existing))
                .build());

        assertEquals("Water Resources", result.getCategoryTag());
        assertTrue(result.getDuplicateMatch().isFound());
        assertEquals(42L, result.getDuplicateMatch().getCandidateIssueId());
    }
}
