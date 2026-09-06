package com.samadhansetu.controller;

import com.samadhansetu.Service.ProjectService;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.enums.ProjectStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/projects") @RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;
    @PostMapping public ResponseEntity<ProjectResponseDto> create(@RequestBody ProjectRequestDto r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));}
    @GetMapping public List<ProjectResponseDto> all(){return service.all();}
    @GetMapping("/{id}") public ProjectResponseDto get(@PathVariable Long id){return service.get(id);}
    @GetMapping("/university/{id}") public List<ProjectResponseDto> byUniversity(@PathVariable Long id){return service.byUniversity(id);}
    @GetMapping("/status/{status}") public List<ProjectResponseDto> byStatus(@PathVariable ProjectStatus status){return service.byStatus(status);}
    @PutMapping("/{id}") public ProjectResponseDto update(@PathVariable Long id,@RequestBody ProjectRequestDto r){return service.update(id,r);}
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
    @PostMapping("/{id}/team") public ResponseEntity<TeamMemberResponseDto> addMember(@PathVariable Long id,@RequestBody TeamMemberRequestDto r){return ResponseEntity.status(HttpStatus.CREATED).body(service.addMember(id,r));}
    @GetMapping("/{id}/team") public List<TeamMemberResponseDto> members(@PathVariable Long id){return service.members(id);}
    @DeleteMapping("/team/{memberId}") public ResponseEntity<Void> removeMember(@PathVariable Long memberId){service.removeMember(memberId);return ResponseEntity.noContent().build();}
    @PostMapping("/{id}/milestones") public ResponseEntity<MilestoneResponseDto> addMilestone(@PathVariable Long id,@RequestBody MilestoneRequestDto r){return ResponseEntity.status(HttpStatus.CREATED).body(service.addMilestone(id,r));}
    @GetMapping("/{id}/milestones") public List<MilestoneResponseDto> milestones(@PathVariable Long id){return service.milestones(id);}
    @PutMapping("/milestones/{milestoneId}") public MilestoneResponseDto updateMilestone(@PathVariable Long milestoneId,@RequestBody MilestoneRequestDto r){return service.updateMilestone(milestoneId,r);}
    @PostMapping("/{id}/tasks") public ResponseEntity<TaskResponseDto> addTask(@PathVariable Long id,@RequestBody TaskRequestDto r){return ResponseEntity.status(HttpStatus.CREATED).body(service.addTask(id,r));}
    @GetMapping("/{id}/tasks") public List<TaskResponseDto> tasks(@PathVariable Long id){return service.tasks(id);}
    @PutMapping("/tasks/{taskId}") public TaskResponseDto updateTask(@PathVariable Long taskId,@RequestBody TaskRequestDto r){return service.updateTask(taskId,r);}
    @DeleteMapping("/tasks/{taskId}") public ResponseEntity<Void> deleteTask(@PathVariable Long taskId){service.deleteTask(taskId);return ResponseEntity.noContent().build();}
}
