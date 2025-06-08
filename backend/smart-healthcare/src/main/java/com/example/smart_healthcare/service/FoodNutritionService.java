package com.example.smart_healthcare.service;

import com.example.smart_healthcare.entity.FoodNutrition;
import com.example.smart_healthcare.repository.FoodNutritionRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class FoodNutritionService {
    private final FoodNutritionRepository foodRepo;
    public FoodNutritionService(FoodNutritionRepository foodRepo) {
        this.foodRepo = foodRepo;
    }
    public Optional<FoodNutrition> findByFoodName(String foodName) {
        return foodRepo.findByFoodName(foodName);
    }
} 