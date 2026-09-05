package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Milestone;
import com.samadhansetu.model.enums.MilestoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByProjectId(Long projectId);
    List<Milestone> findByStatus(MilestoneStatus status);
}
