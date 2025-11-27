package com.ticketbooking.controller;

import com.ticketbooking.dto.ShowDTO;
import com.ticketbooking.service.ShowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events/{eventId}/shows")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ShowController {
    
    @Autowired
    private ShowService showService;
    
    @GetMapping
    public ResponseEntity<List<ShowDTO>> getShowsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(showService.getShowsByEvent(eventId));
    }
    
    @GetMapping("/{showId}")
    public ResponseEntity<ShowDTO> getShowById(@PathVariable Long showId) {
        return ResponseEntity.ok(showService.getShowById(showId));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShowDTO> createShow(@PathVariable Long eventId, 
                                             @Valid @RequestBody ShowDTO showDTO) {
        return ResponseEntity.ok(showService.createShow(eventId, showDTO));
    }
    
    @PutMapping("/{showId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShowDTO> updateShow(@PathVariable Long showId, 
                                              @Valid @RequestBody ShowDTO showDTO) {
        return ResponseEntity.ok(showService.updateShow(showId, showDTO));
    }
    
    @DeleteMapping("/{showId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteShow(@PathVariable Long showId) {
        showService.deleteShow(showId);
        return ResponseEntity.ok().build();
    }
}

