package com.samadhansetu.repository;

import com.samadhansetu.model.entity.Project;
import com.samadhansetu.model.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByUniversityId(Long universityId);
}
