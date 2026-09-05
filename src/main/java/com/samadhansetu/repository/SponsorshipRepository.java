package com.samadhansetu.repository;

import com.samadhansetu.model.entity.Sponsorship;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SponsorshipRepository extends JpaRepository<Sponsorship, Long> {
    List<Sponsorship> findByProjectId(Long projectId);
    List<Sponsorship> findByOrganizationId(Long organizationId);
}
