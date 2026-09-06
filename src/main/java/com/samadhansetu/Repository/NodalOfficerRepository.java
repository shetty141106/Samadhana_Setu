package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.NodalOfficer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NodalOfficerRepository extends JpaRepository<NodalOfficer, Long> {
    Optional<NodalOfficer> findByUserId(Long userId);
}
