package com.ticketbooking.dto;

import com.ticketbooking.model.Event;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventDTO {
    private Long id;
    private String title;
    private Event.EventCategory category;
    private String description;
    private String image;
    private String duration;
    private String language;
    private String genre;
    private Double rating;
    private Boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ShowDTO> shows;
}

