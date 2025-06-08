package com.example.smart_healthcare.entity;

import jakarta.persistence.*;
import java.util.Map;

@Entity
@Table(name = "food_nutrition")
public class FoodNutrition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_name", unique = true, nullable = false)
    private String foodName;

    @Column(name = "food_group")
    private String foodGroup;

    // CSV 헤더 그대로 모든 영양소를 저장할 Map
    @Convert(converter = JsonAttributeConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Float> nutrients;

    //--- getters & setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getFoodGroup() { return foodGroup; }
    public void setFoodGroup(String foodGroup) { this.foodGroup = foodGroup; }

    public Map<String, Float> getNutrients() { return nutrients; }
    public void setNutrients(Map<String, Float> nutrients) { this.nutrients = nutrients; }
} 