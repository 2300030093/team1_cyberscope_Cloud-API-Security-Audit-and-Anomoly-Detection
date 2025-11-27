package com.ticketbooking.config;

import com.ticketbooking.model.Seat;
import com.ticketbooking.model.SeatLock;
import com.ticketbooking.repository.SeatLockRepository;
import com.ticketbooking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ScheduledTasks {
    
    @Autowired
    private SeatLockRepository seatLockRepository;
    
    @Autowired
    private SeatRepository seatRepository;
    
    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void cleanupExpiredSeatLocks() {
        LocalDateTime now = LocalDateTime.now();
        List<SeatLock> expiredLocks = seatLockRepository.findExpiredLocks(now);
        
        for (SeatLock lock : expiredLocks) {
            lock.setActive(false);
            seatLockRepository.save(lock);
            
            Seat seat = lock.getSeat();
            if (seat.getStatus() == Seat.SeatStatus.LOCKED) {
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seatRepository.save(seat);
            }
        }
        
        if (!expiredLocks.isEmpty()) {
            System.out.println("Cleaned up " + expiredLocks.size() + " expired seat locks");
        }
    }
}

