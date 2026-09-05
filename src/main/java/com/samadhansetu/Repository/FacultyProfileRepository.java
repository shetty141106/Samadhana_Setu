package com.samadhansetu.Repository;
import com.samadhansetu.model.entity.FacultyProfile; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface FacultyProfileRepository extends JpaRepository<FacultyProfile,Long>{Optional<FacultyProfile> findByFacultyId(Long facultyId); List<FacultyProfile> findBySpecializationContainingIgnoreCase(String specialization); List<FacultyProfile> findByFacultyUniversityId(Long universityId); List<FacultyProfile> findByFacultyDepartmentId(Long departmentId);}
