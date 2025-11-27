package com.ticketbooking.service;

import com.ticketbooking.dto.ShowDTO;
import com.ticketbooking.model.Event;
import com.ticketbooking.model.Show;
import com.ticketbooking.repository.EventRepository;
import com.ticketbooking.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {
    
    @Autowired
    private ShowRepository showRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    public List<ShowDTO> getShowsByEvent(Long eventId) {
        return showRepository.findByEventId(eventId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ShowDTO getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        return convertToDTO(show);
    }
    
    @Transactional
    public ShowDTO createShow(Long eventId, ShowDTO showDTO) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        Show show = convertToEntity(showDTO);
        show.setEvent(event);
        show = showRepository.save(show);
        return convertToDTO(show);
    }
    
    @Transactional
    public ShowDTO updateShow(Long id, ShowDTO showDTO) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        
        show.setDate(showDTO.getDate());
        show.setTime(showDTO.getTime());
        show.setVenue(showDTO.getVenue());
        show.setBasePrice(showDTO.getBasePrice());
        
        show = showRepository.save(show);
        return convertToDTO(show);
    }
    
    @Transactional
    public void deleteShow(Long id) {
        if (!showRepository.existsById(id)) {
            throw new RuntimeException("Show not found");
        }
        showRepository.deleteById(id);
    }
    
    private ShowDTO convertToDTO(Show show) {
        ShowDTO dto = new ShowDTO();
        dto.setId(show.getId());
        dto.setEventId(show.getEvent().getId());
        dto.setDate(show.getDate());
        dto.setTime(show.getTime());
        dto.setVenue(show.getVenue());
        dto.setBasePrice(show.getBasePrice());
        
        long availableSeats = show.getSeats().stream()
                .filter(seat -> seat.getStatus() == com.ticketbooking.model.Seat.SeatStatus.AVAILABLE)
                .count();
        dto.setAvailableSeats((int) availableSeats);
        
        return dto;
    }
    
    private Show convertToEntity(ShowDTO dto) {
        Show show = new Show();
        show.setDate(dto.getDate());
        show.setTime(dto.getTime());
        show.setVenue(dto.getVenue());
        show.setBasePrice(dto.getBasePrice());
        return show;
    }
}

