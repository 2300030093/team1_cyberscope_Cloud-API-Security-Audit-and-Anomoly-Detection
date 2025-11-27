package com.ticketbooking.service;

import com.ticketbooking.dto.BookingDTO;
import com.ticketbooking.dto.BookingRequest;
import com.ticketbooking.dto.PaymentDTO;
import com.ticketbooking.dto.TicketDTO;
import com.ticketbooking.model.*;
import com.ticketbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ShowRepository showRepository;
    
    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private SeatLockRepository seatLockRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public BookingDTO createBooking(Long showId, BookingRequest request) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Seat> seats = seatRepository.findByShowIdAndIdIn(showId, request.getSeatIds());
        
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Some seats not found");
        }
        
        LocalDateTime now = LocalDateTime.now();
        
        // Verify all seats are locked by this user
        for (Seat seat : seats) {
            SeatLock lock = seatLockRepository.findBySeatIdAndActiveTrue(seat.getId())
                    .orElseThrow(() -> new RuntimeException("Seat " + seat.getId() + " is not locked"));
            
            if (!lock.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Seat " + seat.getId() + " is locked by another user");
            }
            
            if (lock.getExpiresAt().isBefore(now)) {
                throw new RuntimeException("Seat lock has expired for seat " + seat.getId());
            }
            
            if (seat.getStatus() != Seat.SeatStatus.LOCKED) {
                throw new RuntimeException("Seat " + seat.getId() + " is not in locked state");
            }
        }
        
        // Calculate total amount
        double totalAmount = seats.stream()
                .mapToDouble(Seat::getPrice)
                .sum();
        
        // Create booking
        Booking booking = new Booking();
        booking.setBookingId(UUID.randomUUID().toString());
        booking.setUser(user);
        booking.setShow(show);
        booking.setSeats(seats);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setBookingDate(now);
        
        booking = bookingRepository.save(booking);
        
        // Mark seats as booked
        for (Seat seat : seats) {
            seat.setStatus(Seat.SeatStatus.BOOKED);
            seatRepository.save(seat);
            
            // Deactivate lock
            SeatLock lock = seatLockRepository.findBySeatIdAndActiveTrue(seat.getId()).orElse(null);
            if (lock != null) {
                lock.setActive(false);
                seatLockRepository.save(lock);
            }
        }
        
        // Broadcast booking event
        messagingTemplate.convertAndSend("/topic/show." + showId + ".seats", 
            new BookingEvent("seat.booked", request.getSeatIds(), booking.getId()));
        
        return convertToDTO(booking);
    }
    
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }
    
    public BookingDTO getBookingByBookingId(String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }
    
    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setBookingId(booking.getBookingId());
        dto.setUserId(booking.getUser().getId());
        dto.setShowId(booking.getShow().getId());
        dto.setSeats(booking.getSeats().stream()
                .map(seat -> {
                    com.ticketbooking.dto.SeatDTO seatDTO = new com.ticketbooking.dto.SeatDTO();
                    seatDTO.setId(seat.getId());
                    seatDTO.setRow(seat.getRow());
                    seatDTO.setNumber(seat.getNumber());
                    seatDTO.setType(seat.getType());
                    seatDTO.setPrice(seat.getPrice());
                    seatDTO.setStatus(seat.getStatus());
                    return seatDTO;
                })
                .collect(Collectors.toList()));
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setBookingDate(booking.getBookingDate());
        
        if (booking.getTicket() != null) {
            TicketDTO ticketDTO = new TicketDTO();
            ticketDTO.setId(booking.getTicket().getId());
            ticketDTO.setTicketCode(booking.getTicket().getTicketCode());
            ticketDTO.setQrCode(booking.getTicket().getQrCode());
            ticketDTO.setQrCodeData(booking.getTicket().getQrCodeData());
            ticketDTO.setGeneratedAt(booking.getTicket().getGeneratedAt());
            dto.setTicket(ticketDTO);
        }
        
        if (booking.getPayment() != null) {
            PaymentDTO paymentDTO = new PaymentDTO();
            paymentDTO.setId(booking.getPayment().getId());
            paymentDTO.setAmount(booking.getPayment().getAmount());
            paymentDTO.setMethod(booking.getPayment().getMethod());
            paymentDTO.setStatus(booking.getPayment().getStatus());
            paymentDTO.setPaymentId(booking.getPayment().getPaymentId());
            paymentDTO.setTransactionId(booking.getPayment().getTransactionId());
            paymentDTO.setPaymentDate(booking.getPayment().getPaymentDate());
            dto.setPayment(paymentDTO);
        }
        
        return dto;
    }
    
    public static class BookingEvent {
        private String event;
        private List<Long> seatIds;
        private Long bookingId;
        
        public BookingEvent(String event, List<Long> seatIds, Long bookingId) {
            this.event = event;
            this.seatIds = seatIds;
            this.bookingId = bookingId;
        }
        
        public String getEvent() { return event; }
        public void setEvent(String event) { this.event = event; }
        public List<Long> getSeatIds() { return seatIds; }
        public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }
        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    }
}

