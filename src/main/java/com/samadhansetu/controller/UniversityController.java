package com.samadhansetu.controller;

import com.samadhansetu.Service.UniversityService;
import com.samadhansetu.dto.UniversityRequestDto;
import com.samadhansetu.dto.UniversityResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @PostMapping
    public ResponseEntity<UniversityResponseDto> createUniversity(@RequestBody UniversityRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(universityService.createUniversity(request));
    }

    @GetMapping
    public ResponseEntity<List<UniversityResponseDto>> getAllUniversities() {
        return ResponseEntity.ok(universityService.getAllUniversities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityResponseDto> getUniversityById(@PathVariable Long id) {
        return ResponseEntity.ok(universityService.getUniversityById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UniversityResponseDto> updateUniversity(
            @PathVariable Long id,
            @RequestBody UniversityRequestDto request) {
        return ResponseEntity.ok(universityService.updateUniversity(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUniversity(@PathVariable Long id) {
        universityService.deleteUniversity(id);
        return ResponseEntity.ok("University deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<UniversityResponseDto>> searchUniversities(@RequestParam String name) {
        return ResponseEntity.ok(universityService.searchByName(name));
    }

    @GetMapping("/location")
    public ResponseEntity<List<UniversityResponseDto>> searchByLocation(@RequestParam String value) {
        return ResponseEntity.ok(universityService.searchByLocation(value));
    }
}
