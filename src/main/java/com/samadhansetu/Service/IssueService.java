package com.samadhansetu.Service;

import com.samadhansetu.Repository.CitizenRepository;
import com.samadhansetu.Repository.IssueRepository;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.*;
import com.samadhansetu.model.enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class IssueService {
 private final IssueRepository issueRepository;
 private final CitizenRepository citizenRepository;
 private final AiBridgeService aiBridgeService;

 @Transactional
 public IssueResponseDto create(IssueRequestDto request, String email) {
  Citizen citizen = citizenRepository.findByUserEmail(email).orElseThrow(() -> new IllegalArgumentException("Citizen profile not found for authenticated user"));
  Issue issue = Issue.builder().title(request.getTitle()).description(request.getDescription()).location(request.getLocation()).latitude(request.getLatitude()).longitude(request.getLongitude()).status(IssueStatus.REPORTED).priority(request.getPriority()==null?IssuePriority.MEDIUM:request.getPriority()).reportedBy(citizen).build();
  if(request.getEvidenceMedia()!=null) request.getEvidenceMedia().forEach(e -> issue.getEvidenceMedia().add(EvidenceMedia.builder().issue(issue).mediaUrl(e.getMediaUrl()).mediaType(e.getMediaType()).build()));
  Issue saved = issueRepository.save(issue);

  // Prototype contract: every new citizen issue synchronously enters the AI pipeline.
  // AiBridgeService falls back locally if the Python service is unavailable.
  aiBridgeService.processIssue(saved.getId());
  return toDto(saved);
 }
 public List<IssueResponseDto> getAll(){ return issueRepository.findAll().stream().map(this::toDto).toList(); }
 public IssueResponseDto getById(Long id){ return toDto(find(id)); }
 public List<IssueResponseDto> getByCitizen(Long id){ return issueRepository.findByReportedById(id).stream().map(this::toDto).toList(); }
 public List<IssueResponseDto> getByStatus(IssueStatus s){ return issueRepository.findByStatus(s).stream().map(this::toDto).toList(); }
 public List<IssueResponseDto> getByPriority(IssuePriority p){ return issueRepository.findByPriority(p).stream().map(this::toDto).toList(); }
 @Transactional public IssueResponseDto update(Long id, IssueRequestDto r){ Issue i=find(id); i.setTitle(r.getTitle()); i.setDescription(r.getDescription()); i.setLocation(r.getLocation()); i.setLatitude(r.getLatitude()); i.setLongitude(r.getLongitude()); if(r.getPriority()!=null)i.setPriority(r.getPriority()); return toDto(issueRepository.save(i)); }
 @Transactional public IssueResponseDto updateStatus(Long id, IssueStatus s){ Issue i=find(id); i.setStatus(s); return toDto(issueRepository.save(i)); }
 @Transactional public IssueResponseDto updatePriority(Long id, IssuePriority p){ Issue i=find(id); i.setPriority(p); return toDto(issueRepository.save(i)); }
 @Transactional public IssueResponseDto addEvidence(Long id,EvidenceMediaDto d){ Issue i=find(id); i.getEvidenceMedia().add(EvidenceMedia.builder().issue(i).mediaUrl(d.getMediaUrl()).mediaType(d.getMediaType()).build()); return toDto(issueRepository.save(i)); }
 public void delete(Long id){ issueRepository.delete(find(id)); }
 private Issue find(Long id){ return issueRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Issue not found: "+id)); }
 private IssueResponseDto toDto(Issue i){ return IssueResponseDto.builder().id(i.getId()).title(i.getTitle()).description(i.getDescription()).location(i.getLocation()).latitude(i.getLatitude()).longitude(i.getLongitude()).status(i.getStatus()).priority(i.getPriority()).citizenId(i.getReportedBy()==null?null:i.getReportedBy().getId()).evidenceMedia(i.getEvidenceMedia()==null?List.of():i.getEvidenceMedia().stream().map(e->EvidenceMediaDto.builder().mediaUrl(e.getMediaUrl()).mediaType(e.getMediaType()).build()).toList()).build(); }
}
