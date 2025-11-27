package com.ticketbooking.dto;

import com.ticketbooking.model.Payment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;
    private Double amount;
    private Payment.PaymentMethod method;
    private Payment.PaymentStatus status;
    private String paymentId;
    private String transactionId;
    private LocalDateTime paymentDate;
}

