package com.example.smart_healthcare.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class FeatureController {
    private final WebClient aiWebClient;
    public FeatureController(WebClient aiWebClient) {
        this.aiWebClient = aiWebClient;
    }
    @GetMapping("/feature-list")
    public Mono<Object> getFeatureList() {
        return aiWebClient.get()
            .uri("/feature-list")
            .retrieve()
            .bodyToMono(Object.class);
    }
} 