package com.ticketbooking.controller;

import com.ticketbooking.dto.PaymentDTO;
import com.ticketbooking.dto.PaymentRequest;
import com.ticketbooking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/create")
    public ResponseEntity<PaymentDTO> createPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }
    
    @PostMapping("/verify")
    public ResponseEntity<PaymentDTO> verifyPayment(@RequestParam String paymentId, 
                                                   @RequestParam String transactionId) {
        return ResponseEntity.ok(paymentService.verifyPayment(paymentId, transactionId));
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentDTO> getPaymentByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId));
    }
}

