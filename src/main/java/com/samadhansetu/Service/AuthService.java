package com.samadhansetu.Service;

import com.samadhansetu.Repository.CitizenRepository;
import com.samadhansetu.Repository.RoleRepository;
import com.samadhansetu.Repository.UserRepository;
import com.samadhansetu.Security.JwtService;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
 private final UserRepository userRepository; private final RoleRepository roleRepository; private final CitizenRepository citizenRepository; private final PasswordEncoder passwordEncoder; private final AuthenticationManager authenticationManager; private final JwtService jwtService; private final UserDetailsService userDetailsService;
 public AuthResponse register(RegisterRequest request){
  if(userRepository.existsByEmail(request.getEmail())) throw new IllegalArgumentException("Email already registered");
  Role role=roleRepository.findByName("CITIZEN").orElseGet(()->roleRepository.save(Role.builder().name("CITIZEN").description("Citizen user").build()));
  User saved=userRepository.save(User.builder().name(request.getName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).role(role).build());
  citizenRepository.save(Citizen.builder().user(saved).build());
  return toResponse(saved,jwtService.generateToken(userDetailsService.loadUserByUsername(saved.getEmail())));
 }
 public AuthResponse login(AuthRequest request){
  authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
  User user=userRepository.findByEmail(request.getEmail()).orElseThrow(()->new IllegalArgumentException("User not found"));
  return toResponse(user,jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail())));
 }
 private AuthResponse toResponse(User user,String token){return AuthResponse.builder().token(token).userId(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole()==null?null:user.getRole().getName()).build();}
}
