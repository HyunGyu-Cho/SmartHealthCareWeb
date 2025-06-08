package com.example.smart_healthcare.repository;

import com.example.smart_healthcare.entity.FoodImageCache;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodImageCacheRepository extends JpaRepository<FoodImageCache, String> {
} 