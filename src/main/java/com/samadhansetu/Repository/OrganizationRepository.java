package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByGstin(String gstin);
    Optional<Organization> findByCin(String cin);
    List<Organization> findByNameContainingIgnoreCase(String name);
}
