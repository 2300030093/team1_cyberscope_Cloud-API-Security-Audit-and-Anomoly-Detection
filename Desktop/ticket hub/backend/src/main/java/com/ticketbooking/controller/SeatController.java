package com.ticketbooking.controller;

import com.ticketbooking.dto.SeatDTO;
import com.ticketbooking.dto.SeatLockRequest;
import com.ticketbooking.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shows/{showId}/seats")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SeatController {
    
    @Autowired
    private SeatService seatService;
    
    @GetMapping
    public ResponseEntity<List<SeatDTO>> getSeats(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getSeatsByShow(showId));
    }
    
    @PostMapping("/lock")
    public ResponseEntity<List<SeatDTO>> lockSeats(@PathVariable Long showId, 
                                                    @Valid @RequestBody SeatLockRequest request) {
        return ResponseEntity.ok(seatService.lockSeats(showId, request.getSeatIds()));
    }
    
    @PostMapping("/unlock")
    public ResponseEntity<?> unlockSeats(@PathVariable Long showId, 
                                        @Valid @RequestBody SeatLockRequest request) {
        seatService.unlockSeats(showId, request.getSeatIds());
        return ResponseEntity.ok().build();
    }
}

