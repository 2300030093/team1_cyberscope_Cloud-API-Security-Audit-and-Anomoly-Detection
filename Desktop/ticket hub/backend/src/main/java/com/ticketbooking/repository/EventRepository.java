package com.ticketbooking.repository;

import com.ticketbooking.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByFeaturedTrue();
    
    List<Event> findByCategory(Event.EventCategory category);
    
    @Query("SELECT e FROM Event e WHERE e.title LIKE %:keyword% OR e.description LIKE %:keyword%")
    List<Event> searchEvents(String keyword);
}

