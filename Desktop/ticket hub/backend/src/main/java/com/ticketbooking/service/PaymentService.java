package com.ticketbooking.service;

import com.ticketbooking.dto.PaymentDTO;
import com.ticketbooking.dto.PaymentRequest;
import com.ticketbooking.model.Booking;
import com.ticketbooking.model.Payment;
import com.ticketbooking.repository.BookingRepository;
import com.ticketbooking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TicketService ticketService;
    
    @Value("${app.payment.stripe.api-key:}")
    private String stripeApiKey;
    
    @Value("${app.payment.razorpay.key-id:}")
    private String razorpayKeyId;
    
    @Transactional
    public PaymentDTO createPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending state");
        }
        
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());
        payment.setMethod(request.getMethod());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());
        
        payment = paymentRepository.save(payment);
        booking.setPayment(payment);
        bookingRepository.save(booking);
        
        // In a real implementation, you would call the payment gateway API here
        // For now, we'll simulate payment creation
        return convertToDTO(payment);
    }
    
    @Transactional
    public PaymentDTO verifyPayment(String paymentId, String transactionId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        // In a real implementation, verify with payment gateway
        // For now, we'll simulate successful payment
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setTransactionId(transactionId);
        payment = paymentRepository.save(payment);
        
        Booking booking = payment.getBooking();
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        
        // Generate ticket after payment confirmation
        ticketService.generateTicket(booking.getId());
        
        return convertToDTO(payment);
    }
    
    public PaymentDTO getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDTO(payment);
    }
    
    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setMethod(payment.getMethod());
        dto.setStatus(payment.getStatus());
        dto.setPaymentId(payment.getPaymentId());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }
}

