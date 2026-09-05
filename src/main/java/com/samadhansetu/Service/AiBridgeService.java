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
                .issueId(issueId).title(issue.getTitle()).description(issue.getDescription())
                .location(issue.getLocation()).build();
        AiProcessResponse response = process(request);
        applyResult(issue, response);
        return response;
    }

    public AiProcessResponse process(AiProcessRequest request) {
        try {
            AiProcessResponse response = restClient.post().uri(aiServiceUrl)
                    .contentType(MediaType.APPLICATION_JSON).body(request)
                    .retrieve().body(AiProcessResponse.class);
            if (response != null) {
                response.setSource("PYTHON_AI");
                enrichUniversityRecommendation(response);
                return response;
            }
        } catch (Exception ignored) {
            // Fall back to local deterministic prototype processing.
        }
        AiProcessResponse response = fallback(request);
        enrichUniversityRecommendation(response);
        return response;
    }

    private void applyResult(Issue issue, AiProcessResponse response) {
        if (response == null) return;
        issue.setCategory(response.getCategoryTag());
        try {
            issue.setPriority(IssuePriority.valueOf(response.getPriority()));
        } catch (Exception ignored) { }
        issueRepository.save(issue);
    }

    private void enrichUniversityRecommendation(AiProcessResponse response) {
        if (response.getCategoryTag() == null) return;
        List<UniversityRoutingResponseDto> matches = universityRoutingService.route(response.getCategoryTag());
        if (!matches.isEmpty()) response.setMatchedUniversityId(matches.get(0).getUniversityId());
    }

    private AiProcessResponse fallback(AiProcessRequest r) {
        String text = ((r.getTitle() == null ? "" : r.getTitle()) + " " +
                (r.getDescription() == null ? "" : r.getDescription())).toLowerCase(Locale.ROOT);
        Map<String, String[]> rules = new LinkedHashMap<>();
        rules.put("Education", new String[]{"school", "college", "teacher", "student", "education", "विद्यालय", "शिक्षा"});
        rules.put("Agriculture", new String[]{"crop", "farmer", "farm", "agriculture", "किसान", "फसल"});
        rules.put("Healthcare", new String[]{"hospital", "health", "doctor", "medicine", "clinic", "स्वास्थ्य", "अस्पताल"});
        rules.put("Water Resources", new String[]{"water", "drinking water", "well", "river", "pipeline", "पानी", "जल"});
        rules.put("Environment", new String[]{"pollution", "waste", "garbage", "forest", "environment", "प्रदूषण", "कचरा"});
        rules.put("Energy", new String[]{"electricity", "power", "transformer", "street light", "energy", "बिजली"});
        rules.put("Urban Development", new String[]{"road", "drainage", "traffic", "sewer", "municipal", "शहरी", "सड़क"});
        rules.put("Accessibility", new String[]{"wheelchair", "disabled", "ramp", "accessibility", "दिव्यांग"});
        rules.put("Public Administration", new String[]{"office", "government", "certificate", "public service", "प्रशासन", "सरकार"});
        rules.put("Rural Livelihoods", new String[]{"livelihood", "employment", "rural", "handicraft", "रोजगार"});

        String category = "Public Administration";
        double confidence = 0.55;
        List<String> keywords = new ArrayList<>();
        int best = 0;
        for (var e : rules.entrySet()) {
            int hits = 0; List<String> found = new ArrayList<>();
            for (String k : e.getValue()) if (text.contains(k.toLowerCase(Locale.ROOT))) { hits++; found.add(k); }
            if (hits > best) { best = hits; category = e.getKey(); keywords = found; confidence = Math.min(.95, .60 + .12 * hits); }
        }
        String priority = containsAny(text, "death", "accident", "emergency", "मौत", "दुर्घटना") ? "CRITICAL" :
                containsAny(text, "drinking water", "three months", "hospital", "no electricity", "danger") ? "HIGH" :
                containsAny(text, "damaged", "delay", "broken", "blocked", "खराब", "देरी") ? "MEDIUM" : "LOW";
        return AiProcessResponse.builder()
                .issueId(r.getIssueId()).language(text.matches(".*[\\u0900-\\u097F].*") ? "hi" : "en")
                .translatedDescription(r.getDescription()).summary(makeSummary(r.getDescription()))
                .categoryTag(category).confidence(confidence).keywords(keywords.toArray(String[]::new))
                .priority(priority).priorityScore(switch (priority) { case "CRITICAL" -> 92; case "HIGH" -> 78; case "MEDIUM" -> 60; default -> 35; })
                .priorityReasons(new String[]{"deterministic prototype fallback"})
                .source("RULE_BASED_FALLBACK").build();
    }

    private boolean containsAny(String text, String... values) {
        for (String v : values) if (text.contains(v.toLowerCase(Locale.ROOT))) return true;
        return false;
    }

    private String makeSummary(String d) {
        if (d == null || d.isBlank()) return "No description provided.";
        String clean = d.replaceAll("\\s+", " ").trim();
        return clean.length() <= 240 ? clean : clean.substring(0, 237) + "...";
    }
}
