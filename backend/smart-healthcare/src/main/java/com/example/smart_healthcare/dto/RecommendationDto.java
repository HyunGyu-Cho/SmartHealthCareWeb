// DTO: RecommendationDto.java
package com.example.smart_healthcare.dto;

import java.util.List;
import java.util.Map;

public class RecommendationDto {
    private String bodyType;
    private List<FoodDto> foods; // deprecated
    private Map<String, List<WorkoutDto>> workouts;
    private Map<String, Map<String, FoodDto>> diets;
    private String error;
    private String summary;

    // 운동/식단 분리 생성자 (요일별)
    public RecommendationDto(String bodyType, String summary, Map<String, List<WorkoutDto>> workouts, Map<String, Map<String, FoodDto>> diets) {
        this.bodyType = bodyType;
        this.summary = summary;
        this.workouts = workouts;
        this.diets = diets;
    }

    // 기존 foods 생성자 (호환성)
    public RecommendationDto(String bodyType, List<FoodDto> foods) {
        this.bodyType = bodyType;
        this.foods = foods;
    }

    public RecommendationDto(String error) {
        this.error = error;
    }

    public static RecommendationDto of(String bodyType, String summary, Map<String, List<WorkoutDto>> workouts, Map<String, Map<String, FoodDto>> diets) {
        return new RecommendationDto(bodyType, summary, workouts, diets);
    }

    public static RecommendationDto withError(String error) {
        return new RecommendationDto(error);
    }

    // Getters and setters
    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public List<FoodDto> getFoods() {
        return foods;
    }

    public void setFoods(List<FoodDto> foods) {
        this.foods = foods;
    }

    public Map<String, List<WorkoutDto>> getWorkouts() {
        return workouts;
    }

    public void setWorkouts(Map<String, List<WorkoutDto>> workouts) {
        this.workouts = workouts;
    }

    public Map<String, Map<String, FoodDto>> getDiets() {
        return diets;
    }

    public void setDiets(Map<String, Map<String, FoodDto>> diets) {
        this.diets = diets;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
