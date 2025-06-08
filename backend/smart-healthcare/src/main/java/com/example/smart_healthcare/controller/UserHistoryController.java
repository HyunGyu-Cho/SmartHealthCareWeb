package com.example.smart_healthcare.controller;

import com.example.smart_healthcare.entity.UserHistory;
import com.example.smart_healthcare.service.UserHistoryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/history")
public class UserHistoryController {
    private final UserHistoryService service;
    public UserHistoryController(UserHistoryService service) { this.service = service; }

    @PostMapping
    public UserHistory save(@RequestBody UserHistory history) {
        return service.save(history);
    }

    @GetMapping
    public List<UserHistory> getHistory(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return service.findByUserIdAndDateBetween(userId, from, to);
    }
} 