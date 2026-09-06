package com.samadhansetu.config;

import com.samadhansetu.Repository.*;
import com.samadhansetu.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

/**
 * Creates the six SIH demo personas only when SAMADHANSETU_DEMO_PASSWORD is configured.
 * The password is supplied through the deployment environment and is never stored in source code.
 */
@Configuration
@RequiredArgsConstructor
public class DemoUserSeeder {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CitizenRepository citizenRepository;
    private final NodalOfficerRepository nodalOfficerRepository;
    private final FacultyRepository facultyRepository;
    private final FacultyProfileRepository facultyProfileRepository;
    private final StudentRepository studentRepository;
    private final IndustryRepository industryRepository;
    private final AdminRepository adminRepository;
    private final UniversityRepository universityRepository;
    private final DepartmentRepository departmentRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${SAMADHANSETU_DEMO_PASSWORD:}")
    private String demoPassword;

    @Bean
    CommandLineRunner seedDemoUsers() {
        return args -> {
            if (demoPassword == null || demoPassword.isBlank()) return;

            University university = universityRepository.findByCode("DEMO-JH")
                    .orElseGet(() -> universityRepository.save(University.builder()
                            .name("SamadhanSetu Demo University")
                            .code("DEMO-JH")
                            .location("Jharkhand")
                            .build()));

            Department department = departmentRepository.findByUniversityId(university.getId()).stream()
                    .filter(d -> "DEMO-CSE".equalsIgnoreCase(d.getCode()))
                    .findFirst()
                    .orElseGet(() -> departmentRepository.save(Department.builder()
                            .name("Computer Science & Engineering")
                            .code("DEMO-CSE")
                            .university(university)
                            .build()));

            Organization organization = organizationRepository.findByGstin("DEMO-GSTIN-001")
                    .orElseGet(() -> organizationRepository.save(Organization.builder()
                            .name("SamadhanSetu Demo CSR Foundation")
                            .gstin("DEMO-GSTIN-001")
                            .address("Jharkhand")
                            .website("https://example.org")
                            .build()));

            Map<String, String> personas = Map.of(
                    "CITIZEN", "demo.citizen@samadhansetu.in",
                    "NODAL_OFFICER", "demo.nodal@samadhansetu.in",
                    "FACULTY", "demo.faculty@samadhansetu.in",
                    "STUDENT", "demo.student@samadhansetu.in",
                    "INDUSTRY", "demo.industry@samadhansetu.in",
                    "ADMIN", "demo.admin@samadhansetu.in"
            );

            personas.forEach((roleName, email) -> ensureUser(roleName, email, university, department, organization));
        };
    }

    private void ensureUser(String roleName, String email, University university, Department department, Organization organization) {
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(roleName)
                        .description("SamadhanSetu " + roleName + " role")
                        .build()));

        User user = userRepository.findByEmail(email).orElseGet(() -> User.builder()
                .name(displayName(roleName))
                .email(email)
                .build());

        user.setRole(role);
        user.setPassword(passwordEncoder.encode(demoPassword));
        User saved = userRepository.save(user);

        switch (roleName) {
            case "CITIZEN" -> citizenRepository.findByUserEmail(email)
                    .orElseGet(() -> citizenRepository.save(Citizen.builder().user(saved).build()));
            case "NODAL_OFFICER" -> nodalOfficerRepository.findByUserId(saved.getId())
                    .orElseGet(() -> nodalOfficerRepository.save(NodalOfficer.builder().user(saved).assignedArea("Jharkhand").build()));
            case "FACULTY" -> {
                Faculty faculty = facultyRepository.findById(saved.getId()).orElse(null);
                if (faculty == null || !saved.getId().equals(faculty.getId())) {
                    faculty = facultyRepository.findAll().stream()
                            .filter(f -> f.getUser() != null && saved.getId().equals(f.getUser().getId()))
                            .findFirst()
                            .orElseGet(() -> facultyRepository.save(Faculty.builder().user(saved).university(university).department(department).build()));
                }
                final Faculty facultyRef = faculty;
                facultyProfileRepository.findByFacultyId(facultyRef.getId())
                        .orElseGet(() -> facultyProfileRepository.save(FacultyProfile.builder()
                                .faculty(facultyRef).designation("Faculty Advisor").specialization("Civic Technology").build()));
            }
            case "STUDENT" -> studentRepository.findByUserId(saved.getId())
                    .orElseGet(() -> studentRepository.save(Student.builder().user(saved).university(university).department(department).enrollmentNumber("DEMO-STU-" + saved.getId()).build()));
            case "INDUSTRY" -> industryRepository.findByUserId(saved.getId())
                    .orElseGet(() -> industryRepository.save(Industry.builder().user(saved).organization(organization).build()));
            case "ADMIN" -> adminRepository.findByUserId(saved.getId())
                    .orElseGet(() -> adminRepository.save(Admin.builder().user(saved).build()));
            default -> { }
        }
    }

    private String displayName(String roleName) {
        return switch (roleName) {
            case "CITIZEN" -> "SamadhanSetu Demo Citizen";
            case "NODAL_OFFICER" -> "SamadhanSetu Demo Nodal Officer";
            case "FACULTY" -> "SamadhanSetu Demo Faculty";
            case "STUDENT" -> "SamadhanSetu Demo Student Researcher";
            case "INDUSTRY" -> "SamadhanSetu Demo Industry CSR";
            case "ADMIN" -> "SamadhanSetu Demo Administrator";
            default -> "SamadhanSetu Demo User";
        };
    }
}
