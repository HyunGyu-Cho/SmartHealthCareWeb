package com.example.smart_healthcare.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class FeatureService {
    private final WebClient webClient = WebClient.create();

    public Mono<List<String>> getFeatures() {
        return webClient.get()
            .uri("http://localhost:5000/feature-list")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, List<String>>>() {})
            .map(map -> map.get("features"));
    }
}

