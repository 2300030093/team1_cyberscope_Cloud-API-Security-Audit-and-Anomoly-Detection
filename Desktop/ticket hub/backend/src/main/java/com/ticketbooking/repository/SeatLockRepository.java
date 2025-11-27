package com.ticketbooking.repository;

import com.ticketbooking.model.SeatLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatLockRepository extends JpaRepository<SeatLock, Long> {
    List<SeatLock> findByShowIdAndActiveTrue(Long showId);
    
    Optional<SeatLock> findBySeatIdAndActiveTrue(Long seatId);
    
    List<SeatLock> findByUserIdAndShowIdAndActiveTrue(Long userId, Long showId);
    
    @Query("SELECT sl FROM SeatLock sl WHERE sl.expiresAt < :now AND sl.active = true")
    List<SeatLock> findExpiredLocks(LocalDateTime now);
    
    @Modifying
    @Query("UPDATE SeatLock sl SET sl.active = false WHERE sl.expiresAt < :now AND sl.active = true")
    void deactivateExpiredLocks(LocalDateTime now);
    
    void deleteBySeatIdAndUserId(Long seatId, Long userId);
}

