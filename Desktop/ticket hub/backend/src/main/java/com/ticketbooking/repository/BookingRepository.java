package com.ticketbooking.repository;

import com.ticketbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingId(String bookingId);
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByShowId(Long showId);
    
    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);
}

