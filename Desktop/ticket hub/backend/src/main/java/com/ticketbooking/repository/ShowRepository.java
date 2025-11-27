package com.ticketbooking.repository;

import com.ticketbooking.model.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByEventId(Long eventId);
    
    @Query("SELECT s FROM Show s WHERE s.event.id = :eventId AND s.date >= :date ORDER BY s.date, s.time")
    List<Show> findUpcomingShowsByEvent(Long eventId, LocalDate date);
}

