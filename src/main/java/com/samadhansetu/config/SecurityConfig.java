package com.samadhansetu.config;

import com.samadhansetu.Security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/universities/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/universities/**").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.PUT, "/api/universities/**").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.DELETE, "/api/universities/**").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.GET, "/api/departments/**", "/api/faculty-profiles/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/departments/**", "/api/faculty-profiles/**").hasAnyRole("ADMIN", "NODAL_OFFICER", "FACULTY")
                        .requestMatchers(HttpMethod.PUT, "/api/departments/**", "/api/faculty-profiles/**").hasAnyRole("ADMIN", "NODAL_OFFICER", "FACULTY")
                        .requestMatchers(HttpMethod.DELETE, "/api/departments/**", "/api/faculty-profiles/**").hasAnyRole("ADMIN", "NODAL_OFFICER")

                        // Citizens can create issues and read only their own records; staff can manage the platform.
                        .requestMatchers(HttpMethod.POST, "/api/issues").hasRole("CITIZEN")
                        .requestMatchers(HttpMethod.GET, "/api/issues").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.GET, "/api/issues/status/**", "/api/issues/priority/**").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.GET, "/api/issues/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/issues/**").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.PATCH, "/api/issues/**").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.POST, "/api/issues/*/evidence").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers(HttpMethod.DELETE, "/api/issues/**").hasAnyRole("ADMIN", "NODAL_OFFICER")

                        .requestMatchers("/api/ai/**").authenticated()
                        .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "NODAL_OFFICER")
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/projects/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/projects/**").hasAnyRole("ADMIN", "NODAL_OFFICER", "FACULTY")
                        .requestMatchers(HttpMethod.PUT, "/api/projects/**").hasAnyRole("ADMIN", "NODAL_OFFICER", "FACULTY")
                        .requestMatchers(HttpMethod.DELETE, "/api/projects/**").hasAnyRole("ADMIN", "NODAL_OFFICER", "FACULTY")
                        .requestMatchers("/api/industry/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
