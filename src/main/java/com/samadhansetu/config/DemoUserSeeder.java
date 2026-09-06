package com.samadhansetu.config;

import com.samadhansetu.Repository.RoleRepository;
import com.samadhansetu.Repository.UserRepository;
import com.samadhansetu.model.entity.Role;
import com.samadhansetu.model.entity.User;
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
    private final PasswordEncoder passwordEncoder;

    @Value("${SAMADHANSETU_DEMO_PASSWORD:}")
    private String demoPassword;

    @Bean
    CommandLineRunner seedDemoUsers() {
        return args -> {
            if (demoPassword == null || demoPassword.isBlank()) {
                return;
            }

            Map<String, String> personas = Map.of(
                    "CITIZEN", "demo.citizen@samadhansetu.in",
                    "NODAL_OFFICER", "demo.nodal@samadhansetu.in",
                    "FACULTY", "demo.faculty@samadhansetu.in",
                    "STUDENT", "demo.student@samadhansetu.in",
                    "INDUSTRY", "demo.industry@samadhansetu.in",
                    "ADMIN", "demo.admin@samadhansetu.in"
            );

            personas.forEach(this::ensureUser);
        };
    }

    private void ensureUser(String roleName, String email) {
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
        userRepository.save(user);
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
