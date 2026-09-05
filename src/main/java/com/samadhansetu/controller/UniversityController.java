package com.samadhansetu.controller;

import com.samadhansetu.dto.UniversityRequestDto;
import com.samadhansetu.dto.UniversityResponseDto;
import com.samadhansetu.Service.UniversityService;
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


    // CREATE UNIVERSITY
    @PostMapping
    public ResponseEntity<UniversityResponseDto> createUniversity(
            @RequestBody UniversityRequestDto request) {

        UniversityResponseDto response =
                universityService.createUniversity(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // GET ALL UNIVERSITIES
    @GetMapping
    public ResponseEntity<List<UniversityResponseDto>>
    getAllUniversities() {

        return ResponseEntity.ok(
                universityService.getAllUniversities()
        );
    }


    // GET UNIVERSITY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<UniversityResponseDto>
    getUniversityById(@PathVariable Long id) {

        return ResponseEntity.ok(
                universityService.getUniversityById(id)
        );
    }


    // UPDATE UNIVERSITY
    @PutMapping("/{id}")
    public ResponseEntity<UniversityResponseDto>
    updateUniversity(
            @PathVariable Long id,
            @RequestBody UniversityRequestDto request) {

        return ResponseEntity.ok(
                universityService.updateUniversity(
                        id,
                        request
                )
        );
    }


    // DELETE UNIVERSITY
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUniversity(
            @PathVariable Long id) {

        universityService.deleteUniversity(id);

        return ResponseEntity.ok(
                "University deleted successfully"
        );
    }


    // SEARCH BY NAME
    @GetMapping("/search")
    public ResponseEntity<List<UniversityResponseDto>>
    searchUniversities(
            @RequestParam String name) {

        return ResponseEntity.ok(
                universityService.searchByName(name)
        );
    }


    // GET BY CITY
    @GetMapping("/city/{city}")
    public ResponseEntity<List<UniversityResponseDto>>
    getUniversitiesByCity(
            @PathVariable String city) {

        return ResponseEntity.ok(
                universityService.getByCity(city)
        );
    }


    // GET BY STATE
    @GetMapping("/state/{state}")
    public ResponseEntity<List<UniversityResponseDto>>
    getUniversitiesByState(
            @PathVariable String state) {

        return ResponseEntity.ok(
                universityService.getByState(state)
        );
    }
}