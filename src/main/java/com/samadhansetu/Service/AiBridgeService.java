package com.samadhansetu.Service;

import com.samadhansetu.Repository.IssueRepository;
import com.samadhansetu.dto.AiDuplicateMatch;
import com.samadhansetu.dto.AiIssueCandidate;
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
import java.util.stream.Collectors;

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
                .latitude(parseCoordinate(issue.getLatitude()))
                .longitude(parseCoordinate(issue.getLongitude()))
                .candidates(buildCandidates(issueId))
                .build();

        AiProcessResponse response = process(request);
        applyResult(issue, response);
        return response;
    }

    public AiProcessResponse process(AiProcessRequest request) {
        try {
            AiProcessResponse response = restClient.post().uri(aiServiceUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(AiProcessResponse.class);
            if (response != null) {
                if (response.getSource() == null || response.getSource().isBlank()) {
                    response.setSource("PYTHON_AI");
                }
                enrichUniversityRecommendation(response);
                return response;
            }
        } catch (Exception ignored) {
            // Deterministic fallback keeps the prototype operational when the
            // optional Python/Gemini infrastructure is unavailable.
        }

        AiProcessResponse response = fallback(request);
        enrichUniversityRecommendation(response);
        return response;
    }

    private List<AiIssueCandidate> buildCandidates(Long currentIssueId) {
        return issueRepository.findAll().stream()
                .filter(issue -> !Objects.equals(issue.getId(), currentIssueId))
                .map(issue -> AiIssueCandidate.builder()
                        .issueId(issue.getId())
                        .title(issue.getTitle())
                        .description(issue.getDescription())
                        .location(issue.getLocation())
                        .latitude(parseCoordinate(issue.getLatitude()))
                        .longitude(parseCoordinate(issue.getLongitude()))
                        .build())
                .limit(500)
                .collect(Collectors.toList());
    }

    private Double parseCoordinate(String value) {
        try {
            return value == null || value.isBlank() ? null : Double.parseDouble(value);
        } catch (NumberFormatException ignored) {
            return null;
        }
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
        if (response == null || response.getCategoryTag() == null) return;
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
            int hits = 0;
            List<String> found = new ArrayList<>();
            for (String k : e.getValue()) {
                if (text.contains(k.toLowerCase(Locale.ROOT))) {
                    hits++;
                    found.add(k);
                }
            }
            if (hits > best) {
                best = hits;
                category = e.getKey();
                keywords = found;
                confidence = Math.min(.95, .60 + .12 * hits);
            }
        }

        String priority = containsAny(text, "death", "accident", "emergency", "मौत", "दुर्घटना") ? "CRITICAL" :
                containsAny(text, "drinking water", "three months", "hospital", "no electricity", "danger") ? "HIGH" :
                containsAny(text, "damaged", "delay", "broken", "blocked", "खराब", "देरी") ? "MEDIUM" : "LOW";

        AiDuplicateMatch duplicate = localDuplicate(r);
        return AiProcessResponse.builder()
                .issueId(r.getIssueId())
                .language(text.matches(".*[\\u0900-\\u097F].*") ? "hi" : "en")
                .translatedDescription(r.getDescription())
                .summary(makeSummary(r.getDescription()))
                .categoryTag(category)
                .confidence(confidence)
                .keywords(keywords.toArray(String[]::new))
                .priority(priority)
                .priorityScore(switch (priority) { case "CRITICAL" -> 92; case "HIGH" -> 78; case "MEDIUM" -> 60; default -> 35; })
                .priorityReasons(new String[]{"deterministic prototype fallback"})
                .duplicateMatch(duplicate)
                .source("RULE_BASED_FALLBACK")
                .build();
    }

    private AiDuplicateMatch localDuplicate(AiProcessRequest request) {
        String current = normalize((request.getTitle() + " " + request.getDescription()));
        if (current.isBlank() || request.getCandidates() == null) return AiDuplicateMatch.builder().build();
        Set<String> currentTokens = tokens(current);
        AiDuplicateMatch best = AiDuplicateMatch.builder().build();
        double bestScore = 0.0;
        for (AiIssueCandidate candidate : request.getCandidates()) {
            Set<String> candidateTokens = tokens(normalize(candidate.getTitle() + " " + candidate.getDescription()));
            if (candidateTokens.isEmpty()) continue;
            Set<String> intersection = new HashSet<>(currentTokens);
            intersection.retainAll(candidateTokens);
            Set<String> union = new HashSet<>(currentTokens);
            union.addAll(candidateTokens);
            double score = union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
            if (score > bestScore) {
                bestScore = score;
                best = AiDuplicateMatch.builder()
                        .found(score >= 0.55)
                        .similarityPercentage(score * 100)
                        .candidateIssueId(candidate.getIssueId())
                        .distanceKm(null)
                        .build();
            }
        }
        return best;
    }

    private Set<String> tokens(String value) {
        return Arrays.stream(value.toLowerCase(Locale.ROOT).split("[^\\p{L}\\p{N}]+"))
                .filter(token -> token.length() > 2)
                .collect(Collectors.toSet());
    }

    private String normalize(String value) {
        return value == null ? "" : value.replaceAll("\\s+", " ").trim();
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
