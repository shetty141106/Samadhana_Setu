package com.samadhansetu.repository;

import com.samadhansetu.model.entity.Task;
import com.samadhansetu.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedToId(Long userId);
}
