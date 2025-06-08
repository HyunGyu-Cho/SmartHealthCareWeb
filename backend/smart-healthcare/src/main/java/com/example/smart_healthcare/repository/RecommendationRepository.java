package com.example.smart_healthcare.repository;

import com.example.smart_healthcare.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
}