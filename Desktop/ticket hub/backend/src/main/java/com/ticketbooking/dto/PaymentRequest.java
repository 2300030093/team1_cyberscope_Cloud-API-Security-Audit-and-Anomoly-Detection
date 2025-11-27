package com.ticketbooking.dto;

import com.ticketbooking.model.Payment;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;
    
    @NotNull(message = "Payment method is required")
    private Payment.PaymentMethod method;
}

