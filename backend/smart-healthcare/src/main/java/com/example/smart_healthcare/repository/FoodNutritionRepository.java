package com.example.smart_healthcare.repository;

import com.example.smart_healthcare.entity.FoodNutrition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FoodNutritionRepository extends JpaRepository<FoodNutrition, Long> {
    Optional<FoodNutrition> findByFoodName(String foodName);
} 