package com.example.smart_healthcare.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WorkoutDto(
    String name,
    Double calories,
    Integer duration,
    String difficulty,
    String description,
    String id,
    String reason,
    String infoUrl
) {} 