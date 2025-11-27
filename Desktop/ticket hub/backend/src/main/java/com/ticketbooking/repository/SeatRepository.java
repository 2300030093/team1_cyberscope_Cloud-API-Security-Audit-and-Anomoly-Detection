package com.ticketbooking.repository;

import com.ticketbooking.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByShowId(Long showId);
    
    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId AND s.status = 'AVAILABLE'")
    List<Seat> findAvailableSeatsByShow(Long showId);
    
    List<Seat> findByShowIdAndIdIn(Long showId, List<Long> seatIds);
}

