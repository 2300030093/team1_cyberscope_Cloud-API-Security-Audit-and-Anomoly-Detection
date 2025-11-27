package com.ticketbooking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats", indexes = {
    @Index(name = "idx_show_id", columnList = "show_id"),
    @Index(name = "idx_row_number", columnList = "show_id,row,number")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;
    
    @Column(nullable = false)
    private String row;
    
    @Column(nullable = false)
    private Integer number;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatType type;
    
    @Column(nullable = false)
    private Double price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status = SeatStatus.AVAILABLE;
    
    public enum SeatType {
        REGULAR, PREMIUM, VIP
    }
    
    public enum SeatStatus {
        AVAILABLE, LOCKED, BOOKED
    }
}

