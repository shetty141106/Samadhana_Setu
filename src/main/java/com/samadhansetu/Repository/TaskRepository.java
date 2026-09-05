package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Task;
import com.samadhansetu.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByMilestoneId(Long milestoneId);
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByStatus(TaskStatus status);
}
