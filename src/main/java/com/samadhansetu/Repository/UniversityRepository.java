package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByCode(String code);
    boolean existsByCode(String code);
    List<University> findByNameContainingIgnoreCase(String name);
    List<University> findByLocationContainingIgnoreCase(String location);
}
