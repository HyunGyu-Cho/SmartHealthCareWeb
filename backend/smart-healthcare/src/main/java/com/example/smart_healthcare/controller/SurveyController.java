// src/main/java/com/example/smart_healthcare/controller/SurveyController.java

package com.example.smart_healthcare.controller;

import com.example.smart_healthcare.service.ChatGptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.*;

@RestController
@RequestMapping("/api")
public class SurveyController {

    private final ChatGptService chatGptService;

    public SurveyController(ChatGptService chatGptService) {
        this.chatGptService = chatGptService;
    }

    @PostMapping("/survey")
    public Mono<ResponseEntity<?>> analyzeSurvey(@RequestBody Map<String, String> body) {
        String survey = body.get("survey");
        String bodyType = body.get("bodyType");

        Mono<String> workoutsMono = chatGptService.getWorkoutRecommendation(bodyType, survey);
        Mono<String> dietsMono = chatGptService.getDietRecommendation(bodyType, survey);

        return Mono.zip(workoutsMono, dietsMono)
            .map(tuple -> {
                String workoutsJson = tuple.getT1();
                String dietsJson = tuple.getT2();

                String summary = "";
                List<Object> workoutPlan = List.of();
                List<Object> dietPlan = List.of();

                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    // workouts
                    com.fasterxml.jackson.databind.JsonNode wRoot = mapper.readTree(workoutsJson);
                    summary = wRoot.path("summary").asText("");
                    com.fasterxml.jackson.databind.JsonNode wNode = wRoot.get("workouts");
                    if (wNode != null && wNode.isObject()) {
                        ArrayList<Object> tempWorkoutPlan = new ArrayList<>();
                        wNode.fields().forEachRemaining(e -> {
                            tempWorkoutPlan.add(Map.of(e.getKey(), e.getValue()));
                        });
                        workoutPlan = tempWorkoutPlan;
                    }
                    // diets
                    com.fasterxml.jackson.databind.JsonNode dRoot = mapper.readTree(dietsJson);
                    com.fasterxml.jackson.databind.JsonNode dNode = dRoot.get("diets");
                    if (dNode != null && dNode.isObject()) {
                        ArrayList<Object> tempDietPlan = new ArrayList<>();
                        dNode.fields().forEachRemaining(e -> {
                            tempDietPlan.add(Map.of(e.getKey(), e.getValue()));
                        });
                        dietPlan = tempDietPlan;
                    }
                } catch (Exception e) {
                    return ResponseEntity.internalServerError().body(Map.of("error", "AI 응답 파싱 실패: " + e.getMessage()));
                }

                Map<String, Object> response = new HashMap<>();
                response.put("summary", summary);
                response.put("workoutPlan", workoutPlan);
                response.put("dietPlan", dietPlan);
                return ResponseEntity.ok(response);
            });
    }

    @PostMapping("/analyze-survey")
    public Mono<ResponseEntity<?>> analyzeSurveyKeywords(@RequestBody Map<String, String> body) {
        String survey = body.get("survey");
        String prompt = "아래 문장에서 강화하고 싶은 신체 부위만 뽑아줘. 예: ['복근','하체']\n" + survey;

        return chatGptService.getKeywordExtraction(prompt)
                .map(keywords -> ResponseEntity.ok(Map.of("keywords", keywords)));
    }
}
