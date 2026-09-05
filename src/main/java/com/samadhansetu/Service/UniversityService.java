package com.samadhansetu.Service;

import com.samadhansetu.Repository.UniversityRepository;
import com.samadhansetu.dto.UniversityRequestDto;
import com.samadhansetu.dto.UniversityResponseDto;
import com.samadhansetu.model.entity.University;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityResponseDto createUniversity(UniversityRequestDto request) {
        if (request.getCode() != null && universityRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("University with code already exists: " + request.getCode());
        }
        University university = new University();
        university.setName(request.getName());
        university.setCode(request.getCode());
        university.setLocation(request.getLocation());
        return convertToResponse(universityRepository.save(university));
    }

    public UniversityResponseDto getUniversityById(Long id) {
        return convertToResponse(findUniversity(id));
    }

    public List<UniversityResponseDto> getAllUniversities() {
        return universityRepository.findAll().stream().map(this::convertToResponse).toList();
    }

    public UniversityResponseDto updateUniversity(Long id, UniversityRequestDto request) {
        University university = findUniversity(id);
        if (request.getCode() != null && !request.getCode().equals(university.getCode())
                && universityRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("University with code already exists: " + request.getCode());
        }
        university.setName(request.getName());
        university.setCode(request.getCode());
        university.setLocation(request.getLocation());
        return convertToResponse(universityRepository.save(university));
    }

    public void deleteUniversity(Long id) {
        universityRepository.delete(findUniversity(id));
    }

    public List<UniversityResponseDto> searchByName(String name) {
        return universityRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToResponse).toList();
    }

    public List<UniversityResponseDto> searchByLocation(String location) {
        return universityRepository.findByLocationContainingIgnoreCase(location).stream()
                .map(this::convertToResponse).toList();
    }

    private University findUniversity(Long id) {
        return universityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("University not found with id: " + id));
    }

    private UniversityResponseDto convertToResponse(University university) {
        return UniversityResponseDto.builder()
                .id(university.getId())
                .name(university.getName())
                .code(university.getCode())
                .location(university.getLocation())
                .build();
    }
}
