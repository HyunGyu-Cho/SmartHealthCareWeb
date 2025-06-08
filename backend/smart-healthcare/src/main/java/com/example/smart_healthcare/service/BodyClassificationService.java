// src/main/java/com/example/smart_healthcare/service/BodyClassificationService.java

package com.example.smart_healthcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class BodyClassificationService {

    private final WebClient webClient = WebClient.create("http://localhost:5000");

    public Mono<String> classify(Map<String, Object> inbody) {
        return webClient.post()
                .uri("/classify-body")
                .bodyValue(inbody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(node -> node.get("bodyType").asText());
    }
}
