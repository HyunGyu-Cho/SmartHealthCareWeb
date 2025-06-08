package com.example.smart_healthcare.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;

@Component
public class ClassifierClient {
    private final WebClient webClient = WebClient.create("http://localhost:5000");

    public Mono<Map<String, Object>> classifyBody(Map<String, Object> inbody) {
        Map<String, Object> req = Map.of("inbody", inbody);
        return webClient.post()
                .uri("/classify-body")
                .bodyValue(req)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }
} 