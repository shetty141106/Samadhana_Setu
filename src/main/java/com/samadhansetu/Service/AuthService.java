package com.samadhansetu.Service;

import com.samadhansetu.Repository.RoleRepository;
import com.samadhansetu.Repository.UserRepository;
import com.samadhansetu.Security.JwtService;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.Role;
import com.samadhansetu.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new IllegalArgumentException("Email already registered");
        Role role = roleRepository.findByName("CITIZEN").orElseGet(() -> roleRepository.save(Role.builder().name("CITIZEN").description("Citizen user").build()));
        User user = User.builder().name(request.getName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).role(role).build();
        User saved = userRepository.save(user);
        return toResponse(saved, jwtService.generateToken(userDetailsService.loadUserByUsername(saved.getEmail())));
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        return toResponse(user, jwtService.generateToken(details));
    }

    private AuthResponse toResponse(User user, String token) {
        return AuthResponse.builder().token(token).userId(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole() == null ? null : user.getRole().getName()).build();
    }
}
