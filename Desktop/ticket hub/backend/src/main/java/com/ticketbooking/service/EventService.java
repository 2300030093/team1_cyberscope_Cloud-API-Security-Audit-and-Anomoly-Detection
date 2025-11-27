package com.ticketbooking.service;

import com.ticketbooking.dto.EventDTO;
import com.ticketbooking.model.Event;
import com.ticketbooking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private org.springframework.core.env.Environment env;
    
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDTO(event);
    }
    
    @Transactional
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = convertToEntity(eventDTO);
        event = eventRepository.save(event);
        return convertToDTO(event);
    }
    
    @Transactional
    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setTitle(eventDTO.getTitle());
        event.setCategory(eventDTO.getCategory());
        event.setDescription(eventDTO.getDescription());
        event.setDuration(eventDTO.getDuration());
        event.setLanguage(eventDTO.getLanguage());
        event.setGenre(eventDTO.getGenre());
        event.setRating(eventDTO.getRating());
        event.setFeatured(eventDTO.getFeatured());
        
        event = eventRepository.save(event);
        return convertToDTO(event);
    }
    
    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(id);
    }
    
    @Transactional
    public String uploadPoster(Long id, MultipartFile file) throws IOException {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        String uploadDir = env.getProperty("app.file.poster-dir", "./uploads/posters");
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String fileName = "event_" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        String imageUrl = "/uploads/posters/" + fileName;
        event.setImage(imageUrl);
        eventRepository.save(event);
        
        return imageUrl;
    }
    
    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setCategory(event.getCategory());
        dto.setDescription(event.getDescription());
        dto.setImage(event.getImage());
        dto.setDuration(event.getDuration());
        dto.setLanguage(event.getLanguage());
        dto.setGenre(event.getGenre());
        dto.setRating(event.getRating());
        dto.setFeatured(event.getFeatured());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        return dto;
    }
    
    private Event convertToEntity(EventDTO dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setCategory(dto.getCategory());
        event.setDescription(dto.getDescription());
        event.setImage(dto.getImage());
        event.setDuration(dto.getDuration());
        event.setLanguage(dto.getLanguage());
        event.setGenre(dto.getGenre());
        event.setRating(dto.getRating());
        event.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        return event;
    }
}

