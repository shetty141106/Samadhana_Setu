package com.samadhansetu.Service;

import com.samadhansetu.Repository.*;
import com.samadhansetu.model.enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class DashboardService {
 private final IssueRepository issues; private final ProjectRepository projects; private final OrganizationRepository organizations; private final SponsorshipRepository sponsorships; private final UniversityRepository universities; private final TaskRepository tasks;
 public Map<String,Object> summary(){Map<String,Object> m=new LinkedHashMap<>();m.put("issues",issues.count());m.put("projects",projects.count());m.put("universities",universities.count());m.put("organizations",organizations.count());m.put("sponsorships",sponsorships.count());m.put("tasks",tasks.count());m.put("openIssues",issues.findAll().stream().filter(i->i.getStatus()!=IssueStatus.RESOLVED&&i.getStatus()!=IssueStatus.REJECTED).count());m.put("activeProjects",projects.findByStatus(ProjectStatus.ACTIVE).size());return m;}
 public Map<String,Long> issueStatus(){return issues.findAll().stream().collect(Collectors.groupingBy(i->i.getStatus()==null?"UNKNOWN":i.getStatus().name(),LinkedHashMap::new,Collectors.counting()));}
 public Map<String,Long> issuePriority(){return issues.findAll().stream().collect(Collectors.groupingBy(i->i.getPriority()==null?"UNKNOWN":i.getPriority().name(),LinkedHashMap::new,Collectors.counting()));}
 public Map<String,Long> issueCategories(){return issues.findAll().stream().collect(Collectors.groupingBy(i->i.getCategory()==null||i.getCategory().isBlank()?"UNCATEGORIZED":i.getCategory(),LinkedHashMap::new,Collectors.counting()));}
 public Map<String,Long> projectStatus(){return projects.findAll().stream().collect(Collectors.groupingBy(p->p.getStatus()==null?"UNKNOWN":p.getStatus().name(),LinkedHashMap::new,Collectors.counting()));}
 public Map<String,Long> taskStatus(){return tasks.findAll().stream().collect(Collectors.groupingBy(t->t.getStatus()==null?"UNKNOWN":t.getStatus().name(),LinkedHashMap::new,Collectors.counting()));}
 public List<Map<String,Object>> universityParticipation(){return universities.findAll().stream().map(u->{Map<String,Object>x=new LinkedHashMap<>();x.put("universityId",u.getId());x.put("universityName",u.getName());x.put("projectCount",projects.findByUniversityId(u.getId()).size());x.put("location",u.getLocation());return x;}).toList();}
 public List<Map<String,Object>> locationAnalytics(){Map<String,Long> c=issues.findAll().stream().filter(i->i.getLocation()!=null&&!i.getLocation().isBlank()).collect(Collectors.groupingBy(i->i.getLocation().trim(),Collectors.counting()));return c.entrySet().stream().sorted(Map.Entry.<String,Long>comparingByValue().reversed()).map(e->{Map<String,Object>x=new LinkedHashMap<>();x.put("location",e.getKey());x.put("issueCount",e.getValue());return x;}).toList();}
 public Map<String,Object> financials(){Map<String,Object>m=new LinkedHashMap<>();m.put("sponsorshipCount",sponsorships.count());m.put("totalSponsorshipAmount",sponsorships.findAll().stream().map(s->s.getAmount()==null?java.math.BigDecimal.ZERO:s.getAmount()).reduce(java.math.BigDecimal.ZERO,java.math.BigDecimal::add));return m;}
}
