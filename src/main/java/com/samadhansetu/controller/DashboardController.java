package com.samadhansetu.controller;

import com.samadhansetu.Service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/dashboard") @RequiredArgsConstructor
public class DashboardController {
 private final DashboardService service;
 @GetMapping("/summary") public Map<String,Object> summary(){return service.summary();}
 @GetMapping("/issues/status") public Map<String,Long> issueStatus(){return service.issueStatus();}
 @GetMapping("/issues/priority") public Map<String,Long> issuePriority(){return service.issuePriority();}
 @GetMapping("/issues/categories") public Map<String,Long> issueCategories(){return service.issueCategories();}
 @GetMapping("/projects/status") public Map<String,Long> projectStatus(){return service.projectStatus();}
 @GetMapping("/tasks/status") public Map<String,Long> taskStatus(){return service.taskStatus();}
 @GetMapping("/universities") public List<Map<String,Object>> universityParticipation(){return service.universityParticipation();}
 @GetMapping("/locations") public List<Map<String,Object>> locationAnalytics(){return service.locationAnalytics();}
 @GetMapping("/financials") public Map<String,Object> financials(){return service.financials();}
}
