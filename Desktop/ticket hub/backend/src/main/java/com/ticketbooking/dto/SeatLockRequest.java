package com.ticketbooking.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class SeatLockRequest {
    @NotEmpty(message = "Seat IDs are required")
    private List<Long> seatIds;
}

