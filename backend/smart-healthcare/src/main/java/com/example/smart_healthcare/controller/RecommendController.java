// src/main/java/com/example/smart_healthcare/controller/RecommendController.java

package com.example.smart_healthcare.controller;

import com.example.smart_healthcare.dto.RecommendRequest;
import com.example.smart_healthcare.dto.RecommendationDto;
import com.example.smart_healthcare.service.OrchestratorService;
import com.example.smart_healthcare.client.ClassifierClient;
import com.example.smart_healthcare.dto.BodyTypeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class RecommendController {

    private final OrchestratorService orchestrator;
    private final ClassifierClient classifierClient;

    @Autowired
    public RecommendController(OrchestratorService orchestrator, ClassifierClient classifierClient) {
        this.orchestrator = orchestrator;
        this.classifierClient = classifierClient;
    }

    // 새로운 분리 엔드포인트: 운동 추천
    @PostMapping("/recommend-workouts")
    public Mono<RecommendationDto> recommendWorkouts(@RequestBody RecommendRequest req) {
        return orchestrator.recommendWorkouts(req)
                .onErrorResume(e -> Mono.just(RecommendationDto.withError(e.getMessage())));
    }

    // 새로운 분리 엔드포인트: 식단 추천
    @PostMapping("/recommend-diets")
    public Mono<RecommendationDto> recommendDiets(@RequestBody RecommendRequest req) {
        return classifierClient.classifyBody(req.getInbody())
            .flatMap(resp -> orchestrator.recommendDietsWithBodyType(req, (String) resp.get("bodyType")));
    }

    // 체형 분류 엔드포인트
    @PostMapping("/classify-body")
    public Mono<BodyTypeDto> classifyBody(@RequestBody(required = false) Map<String, Object> inbody) {
        if (inbody == null) {
            return Mono.just(BodyTypeDto.error("inbody 데이터가 필요합니다."));
        }
        return classifierClient.classifyBody(inbody)
                .map(resp -> new BodyTypeDto(
                    (String) resp.get("bodyType"),
                    (String) resp.get("summary")
                ))
                .onErrorResume(e -> Mono.just(BodyTypeDto.error(e.getMessage())));
    }
}
