package com.samadhansetu.Security;

import com.samadhansetu.Repository.UserRepository;
import com.samadhansetu.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        String role = user.getRole() == null ? "CITIZEN" : user.getRole().getName();
        return User.builder().username(user.getEmail()).password(user.getPassword()).authorities(List.of(new SimpleGrantedAuthority("ROLE_" + role))).build();
    }
}
