package com.ticketbooking.controller;

import com.ticketbooking.dto.BookingDTO;
import com.ticketbooking.dto.BookingRequest;
import com.ticketbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shows/{showId}/book")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@PathVariable Long showId, 
                                                    @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(showId, request));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<BookingDTO> getBookingByBookingId(@PathVariable String bookingId) {
        return ResponseEntity.ok(bookingService.getBookingByBookingId(bookingId));
    }
}

