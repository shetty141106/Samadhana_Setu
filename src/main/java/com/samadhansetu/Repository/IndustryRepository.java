package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Industry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IndustryRepository extends JpaRepository<Industry, Long> {
    Optional<Industry> findByUserId(Long userId);
    Optional<Industry> findByUserEmail(String email);
}
