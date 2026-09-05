package com.samadhansetu.Service;

import com.samadhansetu.Repository.IssueRepository;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.Issue;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiBridgeService {
    private final IssueRepository issueRepository;
    private final UniversityRoutingService universityRoutingService;
    private final RestClient restClient = RestClient.builder().build();

    @Value("${ai.service.url:}")
    private String aiServiceUrl;

    public AiProcessResponse processIssue(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + issueId));
        AiProcessResponse response = process(AiProcessRequest.builder()
                .title(issue.getTitle())
                .description(issue.getDescription())
                .location(issue.getLocation())
                .build());
        response.setIssueId(issueId);
        return response;
    }

    public AiProcessResponse process(AiProcessRequest request) {
        if (aiServiceUrl != null && !aiServiceUrl.isBlank()) {
            try {
                AiProcessResponse external = restClient.post()
                        .uri(aiServiceUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(request)
                        .retrieve()
                        .body(AiProcessResponse.class);
                if (external != null) {
                    external.setSource("PYTHON_AI");
                    enrichUniversityRecommendation(external);
                    return external;
                }
            } catch (Exception ignored) {
                // Fall through to the deterministic local classifier.
            }
        }

        String text = ((request.getTitle() == null ? "" : request.getTitle()) + " "
                + (request.getDescription() == null ? "" : request.getDescription())).toLowerCase(Locale.ROOT);
        String category = "Public Administration";
        double confidence = .55;

        Map<String, String[]> rules = new LinkedHashMap<>();
        rules.put("Education", new String[]{"school", "college", "teacher", "student", "education", "विद्यालय", "शिक्षा"});
        rules.put("Agriculture", new String[]{"crop", "farmer", "farm", "irrigation", "agriculture", "किसान", "फसल"});
        rules.put("Healthcare", new String[]{"hospital", "health", "doctor", "medicine", "clinic", "स्वास्थ्य", "अस्पताल"});
        rules.put("Water Resources", new String[]{"water", "drinking water", "well", "river", "pipeline", "पानी", "जल"});
        rules.put("Environment", new String[]{"pollution", "waste", "garbage", "forest", "environment", "प्रदूषण", "कचरा"});
        rules.put("Energy", new String[]{"electricity", "power", "transformer", "street light", "energy", "बिजली"});
        rules.put("Urban Development", new String[]{"road", "drainage", "traffic", "sewer", "municipal", "शहरी", "सड़क"});
        rules.put("Accessibility", new String[]{"wheelchair", "disabled", "ramp", "accessibility", "दिव्यांग"});
        rules.put("Rural Livelihoods", new String[]{"livelihood", "self help", "employment", "rural", "handicraft", "रोजगार"});

        int best = 0;
        for (var entry : rules.entrySet()) {
            int hits = 0;
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword)) hits++;
            }
            if (hits > best) {
                best = hits;
                category = entry.getKey();
                confidence = Math.min(.95, .60 + .12 * hits);
            }
        }

        Long duplicate = findDuplicate(request);
        String summary = makeSummary(request.getDescription());
        AiProcessResponse response = AiProcessResponse.builder()
                .translatedText(request.getDescription())
                .summary(summary)
                .category(category)
                .confidence(confidence)
                .duplicateIssueId(duplicate)
                .source("RULE_BASED_FALLBACK")
                .build();
        enrichUniversityRecommendation(response);
        return response;
    }

    private void enrichUniversityRecommendation(AiProcessResponse response) {
        if (response.getCategory() == null || response.getCategory().isBlank()) return;
        List<UniversityRoutingResponseDto> recommendations = universityRoutingService.route(response.getCategory());
        if (!recommendations.isEmpty()) {
            UniversityRoutingResponseDto top = recommendations.get(0);
            response.setRecommendedUniversityId(top.getUniversityId());
            response.setRecommendedUniversityName(top.getUniversityName());
        }
    }

    private Long findDuplicate(AiProcessRequest request) {
        String incoming = normalize((request.getTitle() == null ? "" : request.getTitle()) + " "
                + (request.getDescription() == null ? "" : request.getDescription()));
        if (incoming.isBlank()) return null;
        Set<String> words = new HashSet<>(Arrays.asList(incoming.split(" ")));
        if (words.isEmpty()) return null;

        for (Issue issue : issueRepository.findAll()) {
            String existing = normalize((issue.getTitle() == null ? "" : issue.getTitle()) + " "
                    + (issue.getDescription() == null ? "" : issue.getDescription()));
            Set<String> existingWords = new HashSet<>(Arrays.asList(existing.split(" ")));
            if (existingWords.isEmpty()) continue;
            Set<String> intersection = new HashSet<>(words);
            intersection.retainAll(existingWords);
            Set<String> union = new HashSet<>(words);
            union.addAll(existingWords);
            if (!union.isEmpty() && (double) intersection.size() / union.size() >= .70) return issue.getId();
        }
        return null;
    }

    private String normalize(String value) {
        return value.toLowerCase(Locale.ROOT)
                .replaceAll("[^\\p{L}\\p{N} ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String makeSummary(String description) {
        if (description == null || description.isBlank()) return "No description provided.";
        String clean = description.replaceAll("\\s+", " ").trim();
        return clean.length() <= 240 ? clean : clean.substring(0, 237) + "...";
    }
}
