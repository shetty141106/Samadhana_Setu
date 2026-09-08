package com.samadhansetu.controller;

import com.samadhansetu.Service.AdminUserService;
import com.samadhansetu.dto.AdminCreateUserRequest;
import com.samadhansetu.dto.AdminUserResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserAdminController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserResponseDto>> listUsers() {
        return ResponseEntity.ok(adminUserService.listUsers());
    }

    @PostMapping
    public ResponseEntity<AdminUserResponseDto> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminUserService.createUser(request));
    }
}
