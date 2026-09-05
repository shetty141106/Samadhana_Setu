package com.samadhansetu.repository;

import com.samadhansetu.model.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByCin(String cin);
    Optional<Organization> findByGstin(String gstin);
    Optional<Organization> findByUdyam(String udyam);
}
