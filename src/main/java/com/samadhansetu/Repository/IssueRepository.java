package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Issue;
import com.samadhansetu.model.enums.IssuePriority;
import com.samadhansetu.model.enums.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByReportedById(Long citizenId);
    List<Issue> findByStatus(IssueStatus status);
    List<Issue> findByPriority(IssuePriority priority);
    List<Issue> findByLocationContainingIgnoreCase(String location);
}
