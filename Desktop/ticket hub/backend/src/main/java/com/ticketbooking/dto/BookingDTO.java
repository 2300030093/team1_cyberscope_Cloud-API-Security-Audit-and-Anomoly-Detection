package com.ticketbooking.dto;

import com.ticketbooking.model.Booking;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingDTO {
    private Long id;
    private String bookingId;
    private Long userId;
    private Long showId;
    private List<SeatDTO> seats;
    private Double totalAmount;
    private Booking.BookingStatus status;
    private LocalDateTime bookingDate;
    private TicketDTO ticket;
    private PaymentDTO payment;
}

