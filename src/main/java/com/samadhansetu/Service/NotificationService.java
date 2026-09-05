package com.samadhansetu.Service;

import com.samadhansetu.Repository.NotificationRepository;
import com.samadhansetu.Repository.UserRepository;
import com.samadhansetu.dto.NotificationRequestDto;
import com.samadhansetu.dto.NotificationResponseDto;
import com.samadhansetu.model.entity.Notification;
import com.samadhansetu.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationResponseDto create(NotificationRequestDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getUserId()));
        Notification notification = Notification.builder()
                .user(user).title(request.getTitle()).message(request.getMessage())
                .readStatus(false).createdAt(LocalDateTime.now()).build();
        return map(notificationRepository.save(notification));
    }

    public List<NotificationResponseDto> getForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::map).toList();
    }

    public List<NotificationResponseDto> getUnread(Long userId) {
        return notificationRepository.findByUserIdAndReadStatusOrderByCreatedAtDesc(userId, false).stream().map(this::map).toList();
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadStatus(userId, false);
    }

    public NotificationResponseDto markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + id));
        n.setReadStatus(true);
        return map(notificationRepository.save(n));
    }

    public void delete(Long id) {
        if (!notificationRepository.existsById(id)) throw new IllegalArgumentException("Notification not found: " + id);
        notificationRepository.deleteById(id);
    }

    private NotificationResponseDto map(Notification n) {
        return NotificationResponseDto.builder().id(n.getId()).userId(n.getUser().getId())
                .title(n.getTitle()).message(n.getMessage()).readStatus(n.isReadStatus())
                .createdAt(n.getCreatedAt()).build();
    }
}
