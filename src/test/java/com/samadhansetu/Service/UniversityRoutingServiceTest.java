package com.samadhansetu.Service;

import com.samadhansetu.Repository.DepartmentRepository;
import com.samadhansetu.dto.UniversityRoutingResponseDto;
import com.samadhansetu.model.entity.Department;
import com.samadhansetu.model.entity.University;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UniversityRoutingServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private UniversityRoutingService routingService;

    @Test
    void route_shouldRankMatchingDepartments() {
        University university = University.builder().id(1L).name("Jharkhand Technical University")
                .code("JTU").location("Ranchi").build();
        Department engineering = Department.builder().id(10L).name("Computer Science and Engineering")
                .code("CSE").university(university).build();
        Department civil = Department.builder().id(11L).name("Civil Engineering").code("CE")
                .university(university).build();
        when(departmentRepository.findAll()).thenReturn(List.of(engineering, civil));

        List<UniversityRoutingResponseDto> result = routingService.route("Education");

        assertFalse(result.isEmpty());
        assertEquals(10L, result.get(0).getDepartmentId());
        assertTrue(result.get(0).getScore() > 0);
        assertEquals(1L, result.get(0).getUniversityId());
    }

    @Test
    void route_withUnknownCategory_shouldReturnEmptyWhenNothingMatches() {
        University university = University.builder().id(2L).name("General University")
                .code("GU").location("Ranchi").build();
        Department department = Department.builder().id(20L).name("History")
                .university(university).build();
        when(departmentRepository.findAll()).thenReturn(List.of(department));

        List<UniversityRoutingResponseDto> result = routingService.route("NonexistentCategory");

        assertTrue(result.isEmpty());
    }
}
