// DTO: FoodDto.java
package com.example.smart_healthcare.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FoodDto(
    String name,
    Map<String, Double> nutrients,
    String reason,
    List<String> ingredients,
    String description,
    String infoUrl
) {}
