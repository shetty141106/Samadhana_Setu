package com.samadhansetu.controller;

import com.samadhansetu.Service.FacultyProfileService;
import com.samadhansetu.dto.FacultyProfileRequestDto;
import com.samadhansetu.dto.FacultyProfileResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty-profiles")
@RequiredArgsConstructor
public class FacultyProfileController {
    private final FacultyProfileService service;

    @PostMapping
    public ResponseEntity<FacultyProfileResponseDto> create(@RequestBody FacultyProfileRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping("/{id}")
    public FacultyProfileResponseDto get(@PathVariable Long id) { return service.get(id); }

    @GetMapping("/faculty/{facultyId}")
    public FacultyProfileResponseDto byFaculty(@PathVariable Long facultyId) { return service.getByFaculty(facultyId); }

    @GetMapping("/university/{universityId}")
    public List<FacultyProfileResponseDto> byUniversity(@PathVariable Long universityId) { return service.byUniversity(universityId); }

    @GetMapping("/department/{departmentId}")
    public List<FacultyProfileResponseDto> byDepartment(@PathVariable Long departmentId) { return service.byDepartment(departmentId); }

    @GetMapping("/search")
    public List<FacultyProfileResponseDto> search(@RequestParam String specialization) { return service.searchSpecialization(specialization); }

    @PutMapping("/{id}")
    public FacultyProfileResponseDto update(@PathVariable Long id, @RequestBody FacultyProfileRequestDto request) { return service.update(id, request); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
