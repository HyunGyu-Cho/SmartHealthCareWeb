package com.example.smart_healthcare.service;

import com.example.smart_healthcare.entity.UserHistory;
import com.example.smart_healthcare.repository.UserHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserHistoryService {
    private final UserHistoryRepository repo;

    public UserHistoryService(UserHistoryRepository repo) {
        this.repo = repo;
    }

    public UserHistory save(UserHistory history) {
        // 같은 user/date/type 있으면 update, 없으면 insert
        List<UserHistory> exist = repo.findByUserIdAndDate(history.getUserId(), history.getDate());
        for (UserHistory h : exist) {
            if (h.getType().equals(history.getType())) {
                h.setPayload(history.getPayload());
                h.setCompleted(history.getCompleted());
                return repo.save(h);
            }
        }
        return repo.save(history);
    }

    public List<UserHistory> findByUserIdAndDateBetween(Long userId, LocalDate from, LocalDate to) {
        return repo.findByUserIdAndDateBetween(userId, from, to);
    }
} 