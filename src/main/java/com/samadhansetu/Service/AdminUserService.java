package com.samadhansetu.Service;

import com.samadhansetu.Repository.RoleRepository;
import com.samadhansetu.Repository.UserRepository;
import com.samadhansetu.dto.AdminCreateUserRequest;
import com.samadhansetu.dto.AdminUserResponseDto;
import com.samadhansetu.model.entity.Role;
import com.samadhansetu.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private static final Set<String> ALLOWED_ROLES = Set.of("NODAL_OFFICER", "FACULTY", "STUDENT", "INDUSTRY", "ADMIN");

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminUserResponseDto> listUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public AdminUserResponseDto createUser(AdminCreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String roleName = normalizeRole(request.getRole());
        if (!ALLOWED_ROLES.contains(roleName)) {
            throw new IllegalArgumentException("Admin can create only NODAL_OFFICER, FACULTY, STUDENT, INDUSTRY or ADMIN users");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(roleName)
                        .description("SamadhanSetu " + roleName + " role")
                        .build()));

        User saved = userRepository.save(User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase(Locale.ROOT))
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build());

        return toDto(saved);
    }

    private String normalizeRole(String role) {
        String value = role == null ? "" : role.trim().toUpperCase(Locale.ROOT);
        return switch (value) {
            case "NODAL", "NODAL OFFICER" -> "NODAL_OFFICER";
            case "ACADEMIC_FACULTY" -> "FACULTY";
            case "STUDENT_RESEARCHER" -> "STUDENT";
            case "INDUSTRY_CSR" -> "INDUSTRY";
            case "SYSTEM_ADMIN" -> "ADMIN";
            default -> value;
        };
    }

    private AdminUserResponseDto toDto(User user) {
        return AdminUserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() == null ? null : user.getRole().getName())
                .build();
    }
}
