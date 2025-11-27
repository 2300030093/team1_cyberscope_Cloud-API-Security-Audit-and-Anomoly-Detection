package com.ticketbooking.dto;

import com.ticketbooking.model.Seat;
import lombok.Data;

@Data
public class SeatDTO {
    private Long id;
    private String row;
    private Integer number;
    private Seat.SeatType type;
    private Double price;
    private Seat.SeatStatus status;
    private String lockedBy;
    private Long lockExpiry;
}

