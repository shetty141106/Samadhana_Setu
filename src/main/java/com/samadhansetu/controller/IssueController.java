package com.samadhansetu.controller;

import com.samadhansetu.Service.IssueService;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.enums.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IssueService service;

    @PostMapping
    public ResponseEntity<IssueResponseDto> create(@Valid @RequestBody IssueRequestDto request, Authentication authentication) {
        return ResponseEntity.ok(service.create(request, authentication.getName()));
    }

    @GetMapping
    public List<IssueResponseDto> all() { return service.getAll(); }

    @GetMapping("/{id}")
    public IssueResponseDto one(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/citizen/{id}")
    public List<IssueResponseDto> citizen(@PathVariable Long id) { return service.getByCitizen(id); }

    @GetMapping("/status/{status}")
    public List<IssueResponseDto> status(@PathVariable IssueStatus status) { return service.getByStatus(status); }

    @GetMapping("/priority/{priority}")
    public List<IssueResponseDto> priority(@PathVariable IssuePriority priority) { return service.getByPriority(priority); }

    @PutMapping("/{id}")
    public IssueResponseDto update(@PathVariable Long id, @Valid @RequestBody IssueRequestDto request) { return service.update(id, request); }

    @PatchMapping("/{id}/status")
    public IssueResponseDto updateStatus(@PathVariable Long id, @RequestParam IssueStatus status) { return service.updateStatus(id, status); }

    @PatchMapping("/{id}/priority")
    public IssueResponseDto updatePriority(@PathVariable Long id, @RequestParam IssuePriority priority) { return service.updatePriority(id, priority); }

    @PostMapping("/{id}/evidence")
    public IssueResponseDto evidence(@PathVariable Long id, @RequestBody EvidenceMediaDto data) { return service.addEvidence(id, data); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
