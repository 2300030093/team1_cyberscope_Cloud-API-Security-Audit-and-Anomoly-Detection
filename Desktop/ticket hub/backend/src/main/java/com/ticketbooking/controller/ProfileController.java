package com.ticketbooking.controller;

import com.ticketbooking.dto.BookingDTO;
import com.ticketbooking.dto.AuthResponse;
import com.ticketbooking.model.User;
import com.ticketbooking.repository.UserRepository;
import com.ticketbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<AuthResponse> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .toArray(String[]::new));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getUserBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }
    
    @PutMapping("/update")
    public ResponseEntity<AuthResponse> updateProfile(@Valid @RequestBody Map<String, String> updates) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        if (updates.containsKey("phone")) {
            user.setPhone(updates.get("phone"));
        }
        
        user = userRepository.save(user);
        
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .toArray(String[]::new));
        
        return ResponseEntity.ok(response);
    }
}

