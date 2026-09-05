package com.samadhansetu.controller;
import com.samadhansetu.Service.AiBridgeService;
import com.samadhansetu.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/ai") @RequiredArgsConstructor
public class AiIntegrationController {
 private final AiBridgeService aiBridgeService;
 @PostMapping("/process") public AiProcessResponse process(@RequestBody AiProcessRequest request){ return aiBridgeService.process(request); }
 @PostMapping("/issues/{issueId}/process") public AiProcessResponse processIssue(@PathVariable Long issueId){ return aiBridgeService.processIssue(issueId); }
}
