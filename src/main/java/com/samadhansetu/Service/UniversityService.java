package com.samadhansetu.Service;
import com.samadhansetu.Repository.UniversityRepository;
import com.samadhansetu.dto.*; import com.samadhansetu.model.entity.University; import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import java.util.*;
@Service @RequiredArgsConstructor public class UniversityService {
 private final UniversityRepository repo;
 public UniversityResponseDto createUniversity(UniversityRequestDto r){if(r.getCode()!=null&&repo.existsByCode(r.getCode()))throw new IllegalArgumentException("University with code already exists: "+r.getCode()); return map(repo.save(University.builder().name(r.getName()).code(r.getCode()).location(r.getLocation()).build()));}
 public UniversityResponseDto getUniversityById(Long id){return map(repo.findById(id).orElseThrow(()->new IllegalArgumentException("University not found: "+id)));}
 public List<UniversityResponseDto> getAllUniversities(){return repo.findAll().stream().map(this::map).toList();}
 public UniversityResponseDto updateUniversity(Long id,UniversityRequestDto r){University u=repo.findById(id).orElseThrow(()->new IllegalArgumentException("University not found: "+id));u.setName(r.getName());u.setCode(r.getCode());u.setLocation(r.getLocation());return map(repo.save(u));}
 public void deleteUniversity(Long id){if(!repo.existsById(id))throw new IllegalArgumentException("University not found: "+id);repo.deleteById(id);}
 public List<UniversityResponseDto> searchByName(String n){return repo.findByNameContainingIgnoreCase(n).stream().map(this::map).toList();}
 public List<UniversityResponseDto> searchByLocation(String l){return repo.findByLocationContainingIgnoreCase(l).stream().map(this::map).toList();}
 private UniversityResponseDto map(University u){return UniversityResponseDto.builder().id(u.getId()).name(u.getName()).code(u.getCode()).location(u.getLocation()).build();}
}
