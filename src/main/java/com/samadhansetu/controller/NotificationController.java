package com.samadhansetu.controller;

import com.samadhansetu.Service.NotificationService;
import com.samadhansetu.dto.NotificationRequestDto;
import com.samadhansetu.dto.NotificationResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponseDto> create(@RequestBody NotificationRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.create(request));
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponseDto> getForUser(@PathVariable Long userId, Authentication authentication) {
        return notificationService.getForUser(userId, authentication);
    }

    @GetMapping("/user/{userId}/unread")
    public List<NotificationResponseDto> getUnread(@PathVariable Long userId, Authentication authentication) {
        return notificationService.getUnread(userId, authentication);
    }

    @GetMapping("/user/{userId}/unread/count")
    public long unreadCount(@PathVariable Long userId, Authentication authentication) {
        return notificationService.unreadCount(userId, authentication);
    }

    @PutMapping("/{id}/read")
    public NotificationResponseDto markRead(@PathVariable Long id, Authentication authentication) {
        return notificationService.markRead(id, authentication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        notificationService.delete(id, authentication);
        return ResponseEntity.noContent().build();
    }
}
