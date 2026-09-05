package com.samadhansetu.Service;

import com.samadhansetu.dto.UniversityRequestDto;
import com.samadhansetu.dto.UniversityResponseDto;
import com.samadhansetu.model.University;
import com.samadhansetu.Repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UniversityService {

    private final UniversityRepository universityRepository;


    // CREATE UNIVERSITY
    public UniversityResponseDto createUniversity(
            UniversityRequestDto request) {

        if (universityRepository.existsByCode(request.getCode())) {

            throw new RuntimeException(
                    "University with code already exists: "
                            + request.getCode()
            );
        }

        University university = new University();

        university.setName(request.getName());
        university.setCode(request.getCode());
        university.setAddress(request.getAddress());
        university.setCity(request.getCity());
        university.setState(request.getState());
        university.setAccreditation(request.getAccreditation());

        University savedUniversity =
                universityRepository.save(university);

        return convertToResponse(savedUniversity);
    }


    // GET UNIVERSITY BY ID
    public UniversityResponseDto getUniversityById(Long id) {

        University university =
                universityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "University not found with id: " + id
                                )
                        );

        return convertToResponse(university);
    }


    // GET ALL UNIVERSITIES
    public List<UniversityResponseDto> getAllUniversities() {

        return universityRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // UPDATE UNIVERSITY
    public UniversityResponseDto updateUniversity(
            Long id,
            UniversityRequestDto request) {

        University university =
                universityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "University not found with id: " + id
                                )
                        );

        university.setName(request.getName());
        university.setCode(request.getCode());
        university.setAddress(request.getAddress());
        university.setCity(request.getCity());
        university.setState(request.getState());
        university.setAccreditation(request.getAccreditation());

        University updatedUniversity =
                universityRepository.save(university);

        return convertToResponse(updatedUniversity);
    }


    // DELETE UNIVERSITY
    public void deleteUniversity(Long id) {

        University university =
                universityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "University not found with id: " + id
                                )
                        );

        universityRepository.delete(university);
    }


    // SEARCH BY NAME
    public List<UniversityResponseDto> searchByName(
            String name) {

        return universityRepository
                .findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // SEARCH BY CITY
    public List<UniversityResponseDto> getByCity(
            String city) {

        return universityRepository
                .findByCityIgnoreCase(city)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // SEARCH BY STATE
    public List<UniversityResponseDto> getByState(
            String state) {

        return universityRepository
                .findByStateIgnoreCase(state)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ENTITY → RESPONSE DTO
    private UniversityResponseDto convertToResponse(
            University university) {

        return UniversityResponseDto.builder()
                .id(university.getId())
                .name(university.getName())
                .code(university.getCode())
                .address(university.getAddress())
                .city(university.getCity())
                .state(university.getState())
                .accreditation(university.getAccreditation())
                .build();
    }
}