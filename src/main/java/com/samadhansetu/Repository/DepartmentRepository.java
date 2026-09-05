package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByUniversityId(Long universityId);
    boolean existsByUniversityIdAndCode(Long universityId, String code);
    List<Department> findByNameContainingIgnoreCase(String name);
}
