package com.samadhansetu.Service;
import com.samadhansetu.Repository.FacultyProfileRepository; import com.samadhansetu.model.entity.FacultyProfile; import com.samadhansetu.dto.*; import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import java.util.*;
@Service @RequiredArgsConstructor public class FacultyProfileService {
 private final FacultyProfileRepository repo;
 public FacultyProfileResponseDto get(Long id){return map(repo.findById(id).orElseThrow(()->new IllegalArgumentException("Faculty profile not found: "+id)));}
 public FacultyProfileResponseDto getByFaculty(Long id){return map(repo.findByFacultyId(id).orElseThrow(()->new IllegalArgumentException("Faculty profile not found for faculty: "+id)));}
 public List<FacultyProfileResponseDto> byUniversity(Long id){return repo.findByFacultyUniversityId(id).stream().map(this::map).toList();}
 public List<FacultyProfileResponseDto> byDepartment(Long id){return repo.findByFacultyDepartmentId(id).stream().map(this::map).toList();}
 public List<FacultyProfileResponseDto> searchSpecialization(String s){return repo.findBySpecializationContainingIgnoreCase(s).stream().map(this::map).toList();}
 public FacultyProfileResponseDto update(Long id,FacultyProfileRequestDto r){FacultyProfile p=repo.findById(id).orElseThrow(()->new IllegalArgumentException("Faculty profile not found: "+id));p.setDesignation(r.getDesignation());p.setSpecialization(r.getSpecialization());p.setProfileUrl(r.getProfileUrl());return map(repo.save(p));}
 private FacultyProfileResponseDto map(FacultyProfile p){var f=p.getFaculty();return FacultyProfileResponseDto.builder().id(p.getId()).facultyId(f.getId()).userId(f.getUser().getId()).facultyName(f.getUser().getName()).universityId(f.getUniversity()==null?null:f.getUniversity().getId()).departmentId(f.getDepartment()==null?null:f.getDepartment().getId()).designation(p.getDesignation()).specialization(p.getSpecialization()).profileUrl(p.getProfileUrl()).build();}
}
