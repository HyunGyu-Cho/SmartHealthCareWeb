package com.example.smart_healthcare.repository;

import com.example.smart_healthcare.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
}