package com.ticketbooking.service;

import com.ticketbooking.dto.SeatDTO;
import com.ticketbooking.model.Seat;
import com.ticketbooking.model.SeatLock;
import com.ticketbooking.model.Show;
import com.ticketbooking.model.User;
import com.ticketbooking.repository.SeatLockRepository;
import com.ticketbooking.repository.SeatRepository;
import com.ticketbooking.repository.ShowRepository;
import com.ticketbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {
    
    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private ShowRepository showRepository;
    
    @Autowired
    private SeatLockRepository seatLockRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Value("${app.seat-lock.ttl-seconds:180}")
    private int lockTtlSeconds;
    
    public List<SeatDTO> getSeatsByShow(Long showId) {
        List<Seat> seats = seatRepository.findByShowId(showId);
        return seats.stream()
                .map(seat -> convertToDTO(showId, seat))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<SeatDTO> lockSeats(Long showId, List<Long> seatIds) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Seat> seats = seatRepository.findByShowIdAndIdIn(showId, seatIds);
        
        if (seats.size() != seatIds.size()) {
            throw new RuntimeException("Some seats not found");
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusSeconds(lockTtlSeconds);
        
        for (Seat seat : seats) {
            if (seat.getStatus() != Seat.SeatStatus.AVAILABLE) {
                throw new RuntimeException("Seat " + seat.getId() + " is not available");
            }
            
            // Check if already locked
            seatLockRepository.findBySeatIdAndActiveTrue(seat.getId())
                    .ifPresent(lock -> {
                        if (lock.getExpiresAt().isAfter(now) && !lock.getUser().getId().equals(user.getId())) {
                            throw new RuntimeException("Seat " + seat.getId() + " is already locked by another user");
                        }
                    });
            
            seat.setStatus(Seat.SeatStatus.LOCKED);
            seatRepository.save(seat);
            
            SeatLock lock = new SeatLock();
            lock.setShow(show);
            lock.setUser(user);
            lock.setSeat(seat);
            lock.setLockedAt(now);
            lock.setExpiresAt(expiresAt);
            lock.setActive(true);
            seatLockRepository.save(lock);
        }
        
        // Broadcast seat lock event via WebSocket
        messagingTemplate.convertAndSend("/topic/show." + showId + ".seats", 
            new SeatLockEvent("seat.locked", seatIds, user.getId(), expiresAt));
        
        return seats.stream()
                .map(seat -> convertToDTO(showId, seat))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void unlockSeats(Long showId, List<Long> seatIds) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        for (Long seatId : seatIds) {
            SeatLock lock = seatLockRepository.findBySeatIdAndActiveTrue(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat lock not found"));
            
            if (!lock.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Cannot unlock seat locked by another user");
            }
            
            lock.setActive(false);
            seatLockRepository.save(lock);
            
            Seat seat = lock.getSeat();
            seat.setStatus(Seat.SeatStatus.AVAILABLE);
            seatRepository.save(seat);
        }
        
        // Broadcast seat unlock event via WebSocket
        messagingTemplate.convertAndSend("/topic/show." + showId + ".seats", 
            new SeatLockEvent("seat.unlocked", seatIds, user.getId(), null));
    }
    
    private SeatDTO convertToDTO(Long showId, Seat seat) {
        SeatDTO dto = new SeatDTO();
        dto.setId(seat.getId());
        dto.setRow(seat.getRow());
        dto.setNumber(seat.getNumber());
        dto.setType(seat.getType());
        dto.setPrice(seat.getPrice());
        dto.setStatus(seat.getStatus());
        
        // Check if locked
        seatLockRepository.findBySeatIdAndActiveTrue(seat.getId())
                .ifPresent(lock -> {
                    if (lock.getExpiresAt().isAfter(LocalDateTime.now())) {
                        dto.setLockedBy(lock.getUser().getId().toString());
                        dto.setLockExpiry(lock.getExpiresAt().toEpochSecond(java.time.ZoneOffset.UTC) * 1000);
                    }
                });
        
        return dto;
    }
    
    public static class SeatLockEvent {
        private String event;
        private List<Long> seatIds;
        private Long userId;
        private LocalDateTime expiresAt;
        
        public SeatLockEvent(String event, List<Long> seatIds, Long userId, LocalDateTime expiresAt) {
            this.event = event;
            this.seatIds = seatIds;
            this.userId = userId;
            this.expiresAt = expiresAt;
        }
        
        // Getters and setters
        public String getEvent() { return event; }
        public void setEvent(String event) { this.event = event; }
        public List<Long> getSeatIds() { return seatIds; }
        public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    }
}

