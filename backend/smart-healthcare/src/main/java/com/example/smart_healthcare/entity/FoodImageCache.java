package com.example.smart_healthcare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "food_image_cache")
public class FoodImageCache {
    @Id
    @Column(name = "food_name", length = 100)
    private String foodName;

    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;

    public FoodImageCache() {}
    public FoodImageCache(String foodName, String imageUrl) {
        this.foodName = foodName;
        this.imageUrl = imageUrl;
    }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
} 