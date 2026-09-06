package com.samadhansetu.Service;

import com.samadhansetu.Repository.*;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor
public class IndustryService {
    private final OrganizationRepository organizations;
    private final SponsorshipRepository sponsorships;
    private final ProjectRepository projects;
    private final IndustryRepository industries;
    private final UserRepository users;

    public OrganizationResponseDto create(OrganizationRequestDto r) {
        Organization saved = organizations.save(Organization.builder().name(r.getName()).cin(r.getCin()).gstin(r.getGstin()).udyam(r.getUdyam()).address(r.getAddress()).website(r.getWebsite()).build());
        if (!isAdmin()) {
            Industry industry = currentIndustry();
            industry.setOrganization(saved);
            industries.save(industry);
        }
        return map(saved);
    }

    public OrganizationResponseDto get(Long id) { return map(findOrg(id)); }
    public List<OrganizationResponseDto> all() { return organizations.findAll().stream().map(this::map).toList(); }
    public List<OrganizationResponseDto> search(String name) { return organizations.findByNameContainingIgnoreCase(name).stream().map(this::map).toList(); }

    public OrganizationResponseDto update(Long id, OrganizationRequestDto r) {
        Organization o = findOwnedOrg(id);
        o.setName(r.getName()); o.setCin(r.getCin()); o.setGstin(r.getGstin()); o.setUdyam(r.getUdyam()); o.setAddress(r.getAddress()); o.setWebsite(r.getWebsite());
        return map(organizations.save(o));
    }

    public void delete(Long id) { organizations.delete(findOwnedOrg(id)); }

    public SponsorshipResponseDto sponsor(SponsorshipRequestDto r) {
        Organization o = findOrg(r.getOrganizationId());
        if (!isAdmin() && !ownsOrganization(o.getId())) throw new IllegalArgumentException("You can only sponsor using your own industry organization");
        Project p = projects.findById(r.getProjectId()).orElseThrow(() -> new IllegalArgumentException("Project not found: " + r.getProjectId()));
        if (r.getAmount() == null || r.getAmount().signum() <= 0) throw new IllegalArgumentException("Sponsorship amount must be greater than zero");
        return smap(sponsorships.save(Sponsorship.builder().organization(o).project(p).amount(r.getAmount()).status(r.getStatus() == null ? "PENDING" : r.getStatus()).build()));
    }

    public SponsorshipResponseDto getSponsorship(Long id) {
        Sponsorship sponsorship = sponsorships.findById(id).orElseThrow(() -> new IllegalArgumentException("Sponsorship not found: " + id));
        assertSponsorshipAccess(sponsorship);
        return smap(sponsorship);
    }

    public List<SponsorshipResponseDto> sponsorships() {
        if (isAdmin()) return sponsorships.findAll().stream().map(this::smap).toList();
        Long organizationId = currentIndustry().getOrganization() == null ? null : currentIndustry().getOrganization().getId();
        if (organizationId == null) return List.of();
        return sponsorships.findByOrganizationId(organizationId).stream().map(this::smap).toList();
    }

    public List<SponsorshipResponseDto> sponsorshipsByOrganization(Long id) {
        if (!isAdmin() && !ownsOrganization(id)) throw new IllegalArgumentException("You cannot access another organization's sponsorships");
        return sponsorships.findByOrganizationId(id).stream().map(this::smap).toList();
    }

    public List<SponsorshipResponseDto> sponsorshipsByProject(Long id) {
        if (isAdmin()) return sponsorships.findByProjectId(id).stream().map(this::smap).toList();
        Long organizationId = currentIndustry().getOrganization() == null ? null : currentIndustry().getOrganization().getId();
        if (organizationId == null) return List.of();
        return sponsorships.findByProjectId(id).stream().filter(s -> s.getOrganization() != null && organizationId.equals(s.getOrganization().getId())).map(this::smap).toList();
    }

    public SponsorshipResponseDto updateSponsorship(Long id, SponsorshipRequestDto r) {
        Sponsorship s = sponsorships.findById(id).orElseThrow(() -> new IllegalArgumentException("Sponsorship not found: " + id));
        assertSponsorshipAccess(s);
        if (r.getAmount() != null) {
            if (r.getAmount().signum() <= 0) throw new IllegalArgumentException("Sponsorship amount must be greater than zero");
            s.setAmount(r.getAmount());
        }
        if (r.getStatus() != null) s.setStatus(r.getStatus());
        return smap(sponsorships.save(s));
    }

    private Organization findOrg(Long id) { return organizations.findById(id).orElseThrow(() -> new IllegalArgumentException("Organization not found: " + id)); }

    private Organization findOwnedOrg(Long id) {
        Organization organization = findOrg(id);
        if (!isAdmin() && !ownsOrganization(id)) throw new IllegalArgumentException("You cannot modify another organization's record");
        return organization;
    }

    private boolean ownsOrganization(Long organizationId) {
        Industry industry = currentIndustry();
        return industry.getOrganization() != null && organizationId != null && organizationId.equals(industry.getOrganization().getId());
    }

    private Industry currentIndustry() {
        String email = currentEmail();
        return industries.findByUserEmail(email).orElseThrow(() -> new IllegalArgumentException("Industry profile is not configured for this account"));
    }

    private String currentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) throw new IllegalArgumentException("Authenticated user is required");
        return authentication.getName();
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    private void assertSponsorshipAccess(Sponsorship sponsorship) {
        if (!isAdmin() && (sponsorship.getOrganization() == null || !ownsOrganization(sponsorship.getOrganization().getId()))) {
            throw new IllegalArgumentException("You cannot access another organization's sponsorship");
        }
    }

    private OrganizationResponseDto map(Organization o) {
        boolean ready = o.getName() != null && !o.getName().isBlank() && (o.getGstin() != null || o.getCin() != null || o.getUdyam() != null);
        return OrganizationResponseDto.builder().id(o.getId()).name(o.getName()).cin(o.getCin()).gstin(o.getGstin()).udyam(o.getUdyam()).address(o.getAddress()).website(o.getWebsite()).verificationReady(ready).build();
    }

    private SponsorshipResponseDto smap(Sponsorship s) {
        return SponsorshipResponseDto.builder().id(s.getId()).organizationId(s.getOrganization().getId()).organizationName(s.getOrganization().getName()).projectId(s.getProject().getId()).projectTitle(s.getProject().getTitle()).amount(s.getAmount()).status(s.getStatus()).build();
    }
}
