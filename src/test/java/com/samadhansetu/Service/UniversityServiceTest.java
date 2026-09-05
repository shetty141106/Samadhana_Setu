package com.samadhansetu.Service;

import com.samadhansetu.Repository.UniversityRepository;
import com.samadhansetu.dto.UniversityRequestDto;
import com.samadhansetu.dto.UniversityResponseDto;
import com.samadhansetu.model.entity.University;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UniversityServiceTest {

    @Mock
    private UniversityRepository universityRepository;

    @InjectMocks
    private UniversityService universityService;

    @Test
    void createUniversity_shouldSaveAndReturnDto() {
        UniversityRequestDto request = UniversityRequestDto.builder()
                .name("Birla Institute of Technology")
                .code("BIT")
                .location("Ranchi")
                .build();

        University saved = University.builder()
                .id(1L).name("Birla Institute of Technology")
                .code("BIT").location("Ranchi").build();

        when(universityRepository.existsByCode("BIT")).thenReturn(false);
        when(universityRepository.save(any(University.class))).thenReturn(saved);

        UniversityResponseDto result = universityService.createUniversity(request);

        assertEquals(1L, result.getId());
        assertEquals("BIT", result.getCode());
        assertEquals("Ranchi", result.getLocation());
        verify(universityRepository).save(any(University.class));
    }

    @Test
    void createUniversity_shouldRejectDuplicateCode() {
        UniversityRequestDto request = UniversityRequestDto.builder()
                .name("Duplicate University").code("DUP").location("Ranchi").build();
        when(universityRepository.existsByCode("DUP")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> universityService.createUniversity(request));

        assertTrue(ex.getMessage().contains("already exists"));
        verify(universityRepository, never()).save(any());
    }

    @Test
    void getUniversityById_shouldReturnUniversity() {
        University university = University.builder()
                .id(7L).name("Test University").code("TU").location("Dhanbad").build();
        when(universityRepository.findById(7L)).thenReturn(Optional.of(university));

        UniversityResponseDto result = universityService.getUniversityById(7L);

        assertEquals(7L, result.getId());
        assertEquals("Test University", result.getName());
    }

    @Test
    void getAllUniversities_shouldMapAllRecords() {
        when(universityRepository.findAll()).thenReturn(List.of(
                University.builder().id(1L).name("A").code("A1").location("Ranchi").build(),
                University.builder().id(2L).name("B").code("B1").location("Bokaro").build()
        ));

        List<UniversityResponseDto> result = universityService.getAllUniversities();

        assertEquals(2, result.size());
        assertEquals("Bokaro", result.get(1).getLocation());
    }
}
