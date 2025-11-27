package com.ticketbooking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets", indexes = {
    @Index(name = "idx_booking_id", columnList = "booking_id"),
    @Index(name = "idx_ticket_code", columnList = "ticket_code")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;
    
    @Column(name = "ticket_code", unique = true, nullable = false)
    private String ticketCode;
    
    @Column(name = "qr_code", columnDefinition = "TEXT")
    private String qrCode; // Base64 encoded QR code image
    
    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData; // QR code data string
    
    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;
    
    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}

