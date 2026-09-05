package com.samadhansetu.Service;

import com.samadhansetu.Repository.FacultyProfileRepository;
import com.samadhansetu.Repository.FacultyRepository;
import com.samadhansetu.dto.FacultyProfileRequestDto;
import com.samadhansetu.dto.FacultyProfileResponseDto;
import com.samadhansetu.model.entity.FacultyProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyProfileService {
    private final FacultyProfileRepository profileRepository;
    private final FacultyRepository facultyRepository;

    public FacultyProfileResponseDto create(FacultyProfileRequestDto request) {
        if (request.getFacultyId() == null) {
            throw new IllegalArgumentException("facultyId is required");
        }
        if (profileRepository.findByFacultyId(request.getFacultyId()).isPresent()) {
            throw new IllegalArgumentException("Faculty profile already exists for faculty: " + request.getFacultyId());
        }
        var faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found: " + request.getFacultyId()));

        FacultyProfile profile = new FacultyProfile();
        profile.setFaculty(faculty);
        profile.setDesignation(request.getDesignation());
        profile.setSpecialization(request.getSpecialization());
        profile.setProfileUrl(request.getProfileUrl());
        return map(profileRepository.save(profile));
    }

    public FacultyProfileResponseDto get(Long id) {
        return map(profileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Faculty profile not found: " + id)));
    }

    public FacultyProfileResponseDto getByFaculty(Long id) {
        return map(profileRepository.findByFacultyId(id)
                .orElseThrow(() -> new IllegalArgumentException("Faculty profile not found for faculty: " + id)));
    }

    public List<FacultyProfileResponseDto> byUniversity(Long id) {
        return profileRepository.findByFacultyUniversityId(id).stream().map(this::map).toList();
    }

    public List<FacultyProfileResponseDto> byDepartment(Long id) {
        return profileRepository.findByFacultyDepartmentId(id).stream().map(this::map).toList();
    }

    public List<FacultyProfileResponseDto> searchSpecialization(String specialization) {
        return profileRepository.findBySpecializationContainingIgnoreCase(specialization).stream().map(this::map).toList();
    }

    public FacultyProfileResponseDto update(Long id, FacultyProfileRequestDto request) {
        FacultyProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Faculty profile not found: " + id));
        profile.setDesignation(request.getDesignation());
        profile.setSpecialization(request.getSpecialization());
        profile.setProfileUrl(request.getProfileUrl());
        return map(profileRepository.save(profile));
    }

    public void delete(Long id) {
        FacultyProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Faculty profile not found: " + id));
        profileRepository.delete(profile);
    }

    private FacultyProfileResponseDto map(FacultyProfile profile) {
        var faculty = profile.getFaculty();
        return FacultyProfileResponseDto.builder()
                .id(profile.getId())
                .facultyId(faculty.getId())
                .userId(faculty.getUser().getId())
                .facultyName(faculty.getUser().getName())
                .universityId(faculty.getUniversity() == null ? null : faculty.getUniversity().getId())
                .departmentId(faculty.getDepartment() == null ? null : faculty.getDepartment().getId())
                .designation(profile.getDesignation())
                .specialization(profile.getSpecialization())
                .profileUrl(profile.getProfileUrl())
                .build();
    }
}
