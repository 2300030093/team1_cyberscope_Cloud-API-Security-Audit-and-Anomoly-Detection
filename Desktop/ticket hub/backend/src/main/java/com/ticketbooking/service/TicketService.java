package com.ticketbooking.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.ticketbooking.dto.TicketDTO;
import com.ticketbooking.model.Booking;
import com.ticketbooking.model.Ticket;
import com.ticketbooking.repository.BookingRepository;
import com.ticketbooking.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Transactional
    public TicketDTO generateTicket(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getTicket() != null) {
            return convertToDTO(booking.getTicket());
        }
        
        String ticketCode = generateTicketCode(booking);
        String qrCodeData = generateQRCodeData(booking, ticketCode);
        
        // Generate QR code image
        String qrCodeImage = generateQRCodeImage(qrCodeData);
        
        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setTicketCode(ticketCode);
        ticket.setQrCodeData(qrCodeData);
        ticket.setQrCode(qrCodeImage);
        
        ticket = ticketRepository.save(ticket);
        booking.setTicket(ticket);
        bookingRepository.save(booking);
        
        return convertToDTO(ticket);
    }
    
    public TicketDTO getTicketByBookingId(Long bookingId) {
        Ticket ticket = ticketRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return convertToDTO(ticket);
    }
    
    public TicketDTO getTicketByCode(String ticketCode) {
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return convertToDTO(ticket);
    }
    
    private String generateTicketCode(Booking booking) {
        return "TKT-" + booking.getBookingId().substring(0, 8).toUpperCase() + "-" + 
               booking.getId().toString().substring(0, 6);
    }
    
    private String generateQRCodeData(Booking booking, String ticketCode) {
        return String.format(
            "TICKET:%s|BOOKING:%s|SHOW:%d|SEATS:%s|AMOUNT:%.2f",
            ticketCode,
            booking.getBookingId(),
            booking.getShow().getId(),
            booking.getSeats().stream()
                    .map(seat -> seat.getRow() + seat.getNumber())
                    .reduce((a, b) -> a + "," + b)
                    .orElse(""),
            booking.getTotalAmount()
        );
    }
    
    private String generateQRCodeImage(String data) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 300, 300);
            
            int width = bitMatrix.getWidth();
            int height = bitMatrix.getHeight();
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            byte[] imageBytes = baos.toByteArray();
            
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
    
    private TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setTicketCode(ticket.getTicketCode());
        dto.setQrCode(ticket.getQrCode());
        dto.setQrCodeData(ticket.getQrCodeData());
        dto.setGeneratedAt(ticket.getGeneratedAt());
        return dto;
    }
}

