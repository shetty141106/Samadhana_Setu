package com.samadhansetu.controller;

import com.samadhansetu.Service.NotificationService;
import com.samadhansetu.dto.NotificationRequestDto;
import com.samadhansetu.dto.NotificationResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<NotificationResponseDto> getForUser(@PathVariable Long userId) {
        return notificationService.getForUser(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<NotificationResponseDto> getUnread(@PathVariable Long userId) {
        return notificationService.getUnread(userId);
    }

    @GetMapping("/user/{userId}/unread/count")
    public long unreadCount(@PathVariable Long userId) {
        return notificationService.unreadCount(userId);
    }

    @PutMapping("/{id}/read")
    public NotificationResponseDto markRead(@PathVariable Long id) {
        return notificationService.markRead(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
