package com.samadhansetu.Service;

import com.samadhansetu.Repository.NotificationRepository;
import com.samadhansetu.Repository.UserRepository;
import com.samadhansetu.dto.NotificationRequestDto;
import com.samadhansetu.dto.NotificationResponseDto;
import com.samadhansetu.model.entity.Notification;
import com.samadhansetu.model.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void create_shouldCreateUnreadNotification() {
        User user = User.builder().id(10L).name("Citizen").email("citizen@test.com").password("x").build();
        Notification saved = Notification.builder().id(1L).user(user).title("Issue Updated")
                .message("Your issue was verified.").readStatus(false).build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(notificationRepository.save(any(Notification.class))).thenReturn(saved);

        NotificationResponseDto result = notificationService.create(NotificationRequestDto.builder()
                .userId(10L).title("Issue Updated").message("Your issue was verified.").build());

        assertEquals(1L, result.getId());
        assertEquals(10L, result.getUserId());
        assertFalse(result.isReadStatus());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void getUnread_shouldReturnOnlyUnreadNotifications() {
        User user = User.builder().id(5L).build();
        Notification notification = Notification.builder().id(2L).user(user)
                .title("New task").message("A task was assigned.").readStatus(false).build();
        when(notificationRepository.findByUserIdAndReadStatusOrderByCreatedAtDesc(5L, false))
                .thenReturn(List.of(notification));

        List<NotificationResponseDto> result = notificationService.getUnread(5L);

        assertEquals(1, result.size());
        assertFalse(result.get(0).isReadStatus());
    }

    @Test
    void markRead_shouldSetReadStatusTrue() {
        User user = User.builder().id(5L).build();
        Notification notification = Notification.builder().id(3L).user(user)
                .title("Alert").message("Test").readStatus(false).build();
        when(notificationRepository.findById(3L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(notification)).thenReturn(notification);

        NotificationResponseDto result = notificationService.markRead(3L);

        assertTrue(result.isReadStatus());
        verify(notificationRepository).save(notification);
    }

    @Test
    void create_shouldRejectUnknownUser() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> notificationService.create(
                NotificationRequestDto.builder().userId(999L).title("x").message("y").build()));
        verify(notificationRepository, never()).save(any());
    }
}
