package com.samadhansetu.Service;

import com.samadhansetu.Repository.IssueRepository;
import com.samadhansetu.dto.AiProcessRequest;
import com.samadhansetu.dto.AiProcessResponse;
import com.samadhansetu.dto.UniversityRoutingResponseDto;
import com.samadhansetu.model.entity.Issue;
import com.samadhansetu.model.enums.IssuePriority;
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

    @Value("${ai.service.url:http://localhost:8000/api/v1/analyze}")
    private String aiServiceUrl;

    public AiProcessResponse processIssue(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + issueId));

        AiProcessRequest request = AiProcessRequest.builder()
                .issueId(issueId)
                .title(issue.getTitle())
                .description(issue.getDescription())
                .location(issue.getLocation())
                .latitude(issue.getLatitude())
                .longitude(issue.getLongitude())
                .build();

        AiProcessResponse response = process(request);
        applyResult(issue, response);
        return response;
    }

    public AiProcessResponse process(AiProcessRequest request) {
        AiProcessResponse response = null;

        if (aiServiceUrl != null && !aiServiceUrl.isBlank()) {
            try {
                response = restClient.post()
                        .uri(aiServiceUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(request)
                        .retrieve()
                        .body(AiProcessResponse.class);
                if (response != null) {
                    response.setSource("PYTHON_AI");
                    enrichUniversityRecommendation(response);
                    return response;
                }
            } catch (Exception ignored) {
                // Local fallback keeps issue processing available when FastAPI is unavailable.
            }
        }

        response = fallback(request);
        enrichUniversityRecommendation(response);
        return response;
    }

    private void applyResult(Issue issue, AiProcessResponse response) {
        if (response == null) return;
        if (response.getCategoryTag() != null && !response.getCategoryTag().isBlank()) {
            issue.setCategory(response.getCategoryTag());
        }
        if (response.getPriority() != null) {
            try {
                issue.setPriority(IssuePriority.valueOf(response.getPriority().toUpperCase(Locale.ROOT)));
            } catch (IllegalArgumentException ignored) {
                // Keep the existing priority when the external service returns an invalid enum.
            }
        }
        issueRepository.save(issue);
    }

    private void enrichUniversityRecommendation(AiProcessResponse response) {
        if (response.getCategoryTag() == null || response.getCategoryTag().isBlank()) return;
        List<UniversityRoutingResponseDto> matches = universityRoutingService.route(response.getCategoryTag());
        if (!matches.isEmpty()) {
            response.setMatchedUniversityId(matches.get(0).getUniversityId());
        }
    }

    private AiProcessResponse fallback(AiProcessRequest request) {
        String text = normalize((request.getTitle() == null ? "" : request.getTitle()) + " " +
                (request.getDescription() == null ? "" : request.getDescription()));
        String category = "Public Administration";
        double confidence = 0.55;

        Map<String, String[]> rules = new LinkedHashMap<>();
        rules.put("Education", new String[]{"school", "college", "teacher", "student", "education", "विद्यालय", "शिक्षा"});
        rules.put("Agriculture", new String[]{"crop", "farmer", "farm", "agriculture", "किसान", "फसल", "खेती"});
        rules.put("Healthcare", new String[]{"hospital", "health", "doctor", "medicine", "clinic", "स्वास्थ्य", "अस्पताल"});
        rules.put("Water Resources", new String[]{"water", "drinking water", "well", "river", "pipeline", "पानी", "जल"});
        rules.put("Environment", new String[]{"pollution", "waste", "garbage", "forest", "environment", "प्रदूषण", "कचरा"});
        rules.put("Energy", new String[]{"electricity", "power", "transformer", "street light", "energy", "बिजली"});
        rules.put("Urban Development", new String[]{"road", "drainage", "traffic", "sewer", "municipal", "शहरी", "सड़क"});
        rules.put("Accessibility", new String[]{"wheelchair", "disabled", "ramp", "accessibility", "दिव्यांग"});
        rules.put("Public Administration", new String[]{"office", "government", "certificate", "public service", "प्रशासन", "सरकार"});
        rules.put("Rural Livelihoods", new String[]{"livelihood", "self help", "employment", "rural", "handicraft", "रोजगार"});

        int best = 0;
        List<String> keywords = new ArrayList<>();
        for (var entry : rules.entrySet()) {
            int hits = 0;
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword.toLowerCase(Locale.ROOT))) hits++;
            }
            if (hits > best) {
                best = hits;
                category = entry.getKey();
                confidence = Math.min(0.95, 0.60 + 0.12 * hits);
                keywords = Arrays.stream(entry.getValue())
                        .filter(text::contains)
                        .limit(8)
                        .toList();
            }
        }

        String priority = determinePriority(text);
        return AiProcessResponse.builder()
                .issueId(request.getIssueId())
                .language(detectLanguage(text))
                .translatedDescription(request.getDescription())
                .summary(makeSummary(request.getDescription()))
                .categoryTag(category)
                .confidence(confidence)
                .keywords(keywords.toArray(String[]::new))
                .priority(priority)
                .priorityScore(scoreFor(priority))
                .priorityReasons(new String[]{"deterministic prototype fallback"})
                .duplicateFound(false)
                .duplicateSimilarityPercentage(0.0)
                .source("RULE_BASED_FALLBACK")
                .build();
    }

    private String determinePriority(String text) {
        if (containsAny(text, "death", "accident", "unsafe", "contamination", "emergency", "मौत", "दुर्घटना")) return "CRITICAL";
        if (containsAny(text, "drinking water", "three months", "six months", "no electricity", "hospital", "danger", "पिछले तीन महीने")) return "HIGH";
        if (containsAny(text, "frequent", "damaged", "delay", "broken", "blocked", "खराब", "देरी")) return "MEDIUM";
        return "LOW";
    }

    private double scoreFor(String priority) {
        return switch (priority) {
            case "CRITICAL" -> 92.0;
            case "HIGH" -> 78.0;
            case "MEDIUM" -> 60.0;
            default -> 35.0;
        };
    }

    private boolean containsAny(String text, String... values) {
        for (String value : values) {
            if (text.contains(value.toLowerCase(Locale.ROOT))) return true;
        }
        return false;
    }

    private String detectLanguage(String text) {
        return text.matches(".*[\\u0900-\\u097F].*") ? "hi" : "en";
    }

    private String normalize(String value) {
        return value.toLowerCase(Locale.ROOT).replaceAll("[^\\p{L}\\p{N} ]", " ").replaceAll("\\s+", " ").trim();
    }

    private String makeSummary(String description) {
        if (description == null || description.isBlank()) return "No description provided.";
        String cleaned = description.replaceAll("\\s+", " ").trim();
        return cleaned.length() <= 240 ? cleaned : cleaned.substring(0, 237) + "...";
    }
}
