package com.samadhansetu.controller;

import com.samadhansetu.Service.*;
import com.samadhansetu.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/industry")
@RequiredArgsConstructor
public class IndustryController {
    private final IndustryService service;
    private final VerificationService verification;

    @PostMapping("/organizations")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDUSTRY')")
    public ResponseEntity<OrganizationResponseDto> create(@RequestBody OrganizationRequestDto r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }

    @GetMapping("/organizations")
    public List<OrganizationResponseDto> all() {
        return service.all();
    }

    @GetMapping("/organizations/{id}")
    public OrganizationResponseDto get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping("/organizations/search")
    public List<OrganizationResponseDto> search(@RequestParam String name) {
        return service.search(name);
    }

    @GetMapping("/organizations/{id}/verification")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDUSTRY')")
    public Map<String, Object> verify(@PathVariable Long id) {
        return verification.verify(id);
    }

    @PutMapping("/organizations/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDUSTRY')")
    public OrganizationResponseDto update(@PathVariable Long id, @RequestBody OrganizationRequestDto r) {
        return service.update(id, r);
    }

    @DeleteMapping("/organizations/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sponsorships")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDUSTRY')")
    public ResponseEntity<SponsorshipResponseDto> sponsor(@RequestBody SponsorshipRequestDto r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.sponsor(r));
    }

    @GetMapping("/sponsorships")
    public List<SponsorshipResponseDto> sponsorships() {
        return service.sponsorships();
    }

    @GetMapping("/sponsorships/{id}")
    public SponsorshipResponseDto getSponsorship(@PathVariable Long id) {
        return service.getSponsorship(id);
    }

    @GetMapping("/organizations/{id}/sponsorships")
    public List<SponsorshipResponseDto> byOrganization(@PathVariable Long id) {
        return service.sponsorshipsByOrganization(id);
    }

    @GetMapping("/projects/{id}/sponsorships")
    public List<SponsorshipResponseDto> byProject(@PathVariable Long id) {
        return service.sponsorshipsByProject(id);
    }

    @PutMapping("/sponsorships/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDUSTRY')")
    public SponsorshipResponseDto updateSponsorship(@PathVariable Long id, @RequestBody SponsorshipRequestDto r) {
        return service.updateSponsorship(id, r);
    }
}
