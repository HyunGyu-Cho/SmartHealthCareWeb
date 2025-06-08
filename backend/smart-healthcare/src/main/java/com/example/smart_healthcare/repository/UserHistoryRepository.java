package com.example.smart_healthcare.repository;

import com.example.smart_healthcare.entity.UserHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserHistoryRepository extends JpaRepository<UserHistory, Long> {
    List<UserHistory> findByUserIdAndDateBetween(Long userId, LocalDate from, LocalDate to);
    List<UserHistory> findByUserIdAndDate(Long userId, LocalDate date);
} 