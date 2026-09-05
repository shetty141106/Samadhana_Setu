package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.Sponsorship;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SponsorshipRepository extends JpaRepository<Sponsorship, Long> {
    List<Sponsorship> findByOrganizationId(Long organizationId);
    List<Sponsorship> findByProjectId(Long projectId);
    List<Sponsorship> findByStatusIgnoreCase(String status);
}
