package com.ticketbooking.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketDTO {
    private Long id;
    private String ticketCode;
    private String qrCode;
    private String qrCodeData;
    private LocalDateTime generatedAt;
}

