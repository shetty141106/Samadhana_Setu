package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.AiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {
    List<AiAnalysis> findByIssueIdOrderByRanAtDesc(Long issueId);
    Optional<AiAnalysis> findFirstByIssueIdOrderByRanAtDesc(Long issueId);
}
