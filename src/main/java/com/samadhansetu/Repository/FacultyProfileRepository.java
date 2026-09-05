package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.FacultyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FacultyProfileRepository extends JpaRepository<FacultyProfile, Long> {
    Optional<FacultyProfile> findByFacultyId(Long facultyId);
    List<FacultyProfile> findBySpecializationContainingIgnoreCase(String specialization);
    List<FacultyProfile> findByFaculty_University_Id(Long universityId);
    List<FacultyProfile> findByFaculty_Department_Id(Long departmentId);
}
