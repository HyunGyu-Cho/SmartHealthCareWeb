// src/main/java/com/example/smart_healthcare/service/OrchestratorService.java

package com.example.smart_healthcare.service;

import com.example.smart_healthcare.dto.RecommendRequest;
import com.example.smart_healthcare.dto.RecommendationDto;
import com.example.smart_healthcare.dto.FoodDto;
import com.example.smart_healthcare.dto.WorkoutDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class OrchestratorService {

    private static final Logger log = LoggerFactory.getLogger(OrchestratorService.class);
    private final BodyClassificationService bodyClassificationService;
    private final ChatGptService chatGptService;
    private final ObjectMapper mapper = new ObjectMapper();

    public OrchestratorService(
            BodyClassificationService bodyClassificationService,
            ChatGptService chatGptService
    ) {
        this.bodyClassificationService = bodyClassificationService;
        this.chatGptService = chatGptService;
    }

    // 운동 추천: 체형 분류 후 GPT 추천
    public Mono<RecommendationDto> recommendWorkouts(RecommendRequest req) {
        if (req.getInbody() == null || req.getSurvey() == null) {
            return Mono.just(RecommendationDto.withError("inbody와 survey를 모두 입력해 주세요."));
        }
        return bodyClassificationService.classify(req.getInbody())
                .flatMap(bodyType -> chatGptService.getWorkoutRecommendation(bodyType, req.getSurvey())
                        .flatMap(json -> parseWorkoutsJsonToDto(bodyType, json)));
    }

    // 식단 추천: 체형 분류 후 GPT 추천
    public Mono<RecommendationDto> recommendDiets(RecommendRequest req) {
        if (req.getInbody() == null || req.getSurvey() == null) {
            return Mono.just(RecommendationDto.withError("inbody와 survey를 모두 입력해 주세요."));
        }
        return bodyClassificationService.classify(req.getInbody())
                .flatMap(bodyType -> chatGptService.getDietRecommendation(bodyType, req.getSurvey())
                        .flatMap(json -> parseDietsJsonToDto(bodyType, json)));
    }

    public Mono<RecommendationDto> recommendDietsWithBodyType(RecommendRequest req, String bodyType) {
        if (req.getInbody() == null || req.getSurvey() == null) {
            return Mono.just(RecommendationDto.withError("inbody와 survey를 모두 입력해 주세요."));
        }
        return chatGptService.getDietRecommendation(bodyType, req.getSurvey())
                .flatMap(json -> parseDietsJsonToDto(bodyType, json));
    }

    // 운동 추천 JSON 파싱
    private Mono<RecommendationDto> parseWorkoutsJsonToDto(String bodyType, String json) {
        try {
            JsonNode root = mapper.readTree(json);
            String summary = root.path("summary").asText("");
            TypeReference<Map<String, List<WorkoutDto>>> mapType = new TypeReference<>() {};
            Map<String, List<WorkoutDto>> workouts = mapper.convertValue(root.get("workouts"), mapType);
            return Mono.just(RecommendationDto.of(bodyType, summary, workouts, null));
        } catch (Exception e) {
            return Mono.just(RecommendationDto.withError("파싱 실패: " + e.getMessage()));
        }
    }

    // 식단 추천 JSON 파싱
    private Mono<RecommendationDto> parseDietsJsonToDto(String bodyType, String json) {
        try {
            JsonNode root = mapper.readTree(json);
            String summary = root.path("summary").asText("");
            TypeReference<Map<String, Map<String, FoodDto>>> mapType = new TypeReference<>() {};
            Map<String, Map<String, FoodDto>> diets = mapper.readValue(root.get("diets").toString(), mapType);
            return Mono.just(RecommendationDto.of(bodyType, summary, null, diets));
        } catch (JsonProcessingException e) {
            log.error("AI 응답 파싱 실패. 원본: {}", json);
            return Mono.just(RecommendationDto.withError("파싱 실패: " + e.getMessage()));
        } catch (Exception e) {
            return Mono.just(RecommendationDto.withError("파싱 실패: " + e.getMessage()));
        }
    }
}
