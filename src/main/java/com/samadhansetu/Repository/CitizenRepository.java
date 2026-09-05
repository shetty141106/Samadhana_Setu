package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CitizenRepository extends JpaRepository<Citizen, Long> {
    Optional<Citizen> findByUserEmail(String email);
}
