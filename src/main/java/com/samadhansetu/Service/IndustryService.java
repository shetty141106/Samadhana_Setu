package com.samadhansetu.Service;

import com.samadhansetu.Repository.*;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor
public class IndustryService {
    private final OrganizationRepository organizations; private final SponsorshipRepository sponsorships; private final ProjectRepository projects;
    public OrganizationResponseDto create(OrganizationRequestDto r){return map(organizations.save(Organization.builder().name(r.getName()).cin(r.getCin()).gstin(r.getGstin()).udyam(r.getUdyam()).address(r.getAddress()).website(r.getWebsite()).build()));}
    public OrganizationResponseDto get(Long id){return map(findOrg(id));}
    public List<OrganizationResponseDto> all(){return organizations.findAll().stream().map(this::map).toList();}
    public List<OrganizationResponseDto> search(String name){return organizations.findByNameContainingIgnoreCase(name).stream().map(this::map).toList();}
    public OrganizationResponseDto update(Long id,OrganizationRequestDto r){Organization o=findOrg(id);o.setName(r.getName());o.setCin(r.getCin());o.setGstin(r.getGstin());o.setUdyam(r.getUdyam());o.setAddress(r.getAddress());o.setWebsite(r.getWebsite());return map(organizations.save(o));}
    public void delete(Long id){organizations.delete(findOrg(id));}
    public SponsorshipResponseDto sponsor(SponsorshipRequestDto r){Organization o=findOrg(r.getOrganizationId());Project p=projects.findById(r.getProjectId()).orElseThrow(()->new IllegalArgumentException("Project not found: "+r.getProjectId()));return smap(sponsorships.save(Sponsorship.builder().organization(o).project(p).amount(r.getAmount()).status(r.getStatus()==null?"PENDING":r.getStatus()).build()));}
    public SponsorshipResponseDto getSponsorship(Long id){return smap(sponsorships.findById(id).orElseThrow(()->new IllegalArgumentException("Sponsorship not found: "+id)));}
    public List<SponsorshipResponseDto> sponsorships(){return sponsorships.findAll().stream().map(this::smap).toList();}
    public List<SponsorshipResponseDto> sponsorshipsByOrganization(Long id){return sponsorships.findByOrganizationId(id).stream().map(this::smap).toList();}
    public List<SponsorshipResponseDto> sponsorshipsByProject(Long id){return sponsorships.findByProjectId(id).stream().map(this::smap).toList();}
    public SponsorshipResponseDto updateSponsorship(Long id,SponsorshipRequestDto r){Sponsorship s=sponsorships.findById(id).orElseThrow(()->new IllegalArgumentException("Sponsorship not found: "+id));if(r.getAmount()!=null)s.setAmount(r.getAmount());if(r.getStatus()!=null)s.setStatus(r.getStatus());return smap(sponsorships.save(s));}
    private Organization findOrg(Long id){return organizations.findById(id).orElseThrow(()->new IllegalArgumentException("Organization not found: "+id));}
    private OrganizationResponseDto map(Organization o){boolean ready=o.getName()!=null&&!o.getName().isBlank()&&(o.getGstin()!=null||o.getCin()!=null||o.getUdyam()!=null);return OrganizationResponseDto.builder().id(o.getId()).name(o.getName()).cin(o.getCin()).gstin(o.getGstin()).udyam(o.getUdyam()).address(o.getAddress()).website(o.getWebsite()).verificationReady(ready).build();}
    private SponsorshipResponseDto smap(Sponsorship s){return SponsorshipResponseDto.builder().id(s.getId()).organizationId(s.getOrganization().getId()).organizationName(s.getOrganization().getName()).projectId(s.getProject().getId()).projectTitle(s.getProject().getTitle()).amount(s.getAmount()).status(s.getStatus()).build();}
}
