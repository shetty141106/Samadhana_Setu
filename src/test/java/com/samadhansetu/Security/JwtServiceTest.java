package com.samadhansetu.Security;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService();

    private UserDetails user(String username) {
        return User.withUsername(username).password("password").roles("CITIZEN").build();
    }

    @Test
    void generateToken_shouldContainUsername() {
        UserDetails details = user("citizen@test.com");

        String token = jwtService.generateToken(details);

        assertNotNull(token);
        assertEquals("citizen@test.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, details));
    }

    @Test
    void tokenForAnotherUser_shouldNotBeValid() {
        String token = jwtService.generateToken(user("citizen@test.com"));

        assertFalse(jwtService.isTokenValid(token, user("other@test.com")));
    }
}
