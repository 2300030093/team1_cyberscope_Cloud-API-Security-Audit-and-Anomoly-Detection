package com.ticketbooking.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ShowDTO {
    private Long id;
    private Long eventId;
    private LocalDate date;
    private LocalTime time;
    private String venue;
    private Double basePrice;
    private List<SeatDTO> seats;
    private Integer availableSeats;
}

