package com.ticketbooking.controller;

import com.ticketbooking.dto.TicketDTO;
import com.ticketbooking.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @GetMapping("/{orderId}")
    public ResponseEntity<TicketDTO> getTicketByBookingId(@PathVariable Long orderId) {
        return ResponseEntity.ok(ticketService.getTicketByBookingId(orderId));
    }
    
    @GetMapping("/{orderId}/ticket")
    public ResponseEntity<TicketDTO> generateTicket(@PathVariable Long orderId) {
        return ResponseEntity.ok(ticketService.generateTicket(orderId));
    }
    
    @GetMapping("/ticket/{ticketCode}")
    public ResponseEntity<TicketDTO> getTicketByCode(@PathVariable String ticketCode) {
        return ResponseEntity.ok(ticketService.getTicketByCode(ticketCode));
    }
}

