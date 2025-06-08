// src/main/java/com/example/smart_healthcare/service/ChatGptService.java

package com.example.smart_healthcare.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class ChatGptService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public ChatGptService(@Value("${openai.api.key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    // 운동 추천
    public Mono<String> getWorkoutRecommendation(String bodyType, String survey) {
        String prompt = String.format("""
            체형: %s
            설문: %s

            위 정보를 바탕으로 **월~금요일** 요일별로 3가지 운동 루틴을 아래 예시와 같은 JSON 구조로만, 반드시 valid JSON만, 추가 설명 없이, 예시와 동일한 구조로 출력해 주세요.
            ⚠️ 모든 운동 이름은 반드시 영어(English)로 작성하세요.
            각 운동에는 'infoUrl' 필드를 추가해서, 해당 운동명을 YouTube에서 검색한 결과 페이지의 URL(예: https://www.youtube.com/results?search_query=Push+Up)로 넣어주세요.
            예시:
            {
              "summary": "Routine for reducing abdominal fat and improving lower body strength.",
              "workouts": {
                "Monday": [
                  {
                    "name": "Push Up",
                    "calories": 120,
                    "duration": 15,
                    "difficulty": "Medium",
                    "description": "Strengthens upper body.",
                    "reason": "Recommended for chest and triceps.",
                    "infoUrl": "https://www.youtube.com/results?search_query=Push+Up"
                  }
                ]
              }
            }
            ⚠️ 화~금요일도 월요일과 같은 형식으로 작성하세요. 반드시 valid JSON만, 추가 설명 없이 출력하세요.
            """, bodyType, survey);

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", "운동 전문가로만 응답해 주세요. JSON만 출력합니다."),
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 3000,
                "temperature", 0.7
        );

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(resp -> {
                    @SuppressWarnings("unchecked")
                    List<Map<String,Object>> choices = (List<Map<String,Object>>) resp.get("choices");
                    Map<String,Object> message = (Map<String,Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    System.out.println("[AI 운동 추천 응답] " + content);
                    return content;
                });
    }

    // 식단 추천
    public Mono<String> getDietRecommendation(String bodyType, String survey) {
        String prompt = String.format("""
            체형: %s
            설문: %s

            위 정보를 바탕으로 **월~금요일** 요일별로 아침/점심/저녁 식단을 아래 예시와 같은 JSON 구조로만, 반드시 valid JSON만, 추가 설명 없이, 예시와 동일한 구조로 출력해 주세요.
            ⚠️ 모든 음식 이름은 반드시 영어(English)로 작성하세요.
            각 식단에는 'infoUrl' 필드를 추가해서, 해당 음식명을 YouTube에서 검색한 결과 페이지의 URL(예: https://www.youtube.com/results?search_query=Salmon+Quinoa+Bowl)로 넣어주세요.
            예시:
            {
              "summary": "High-protein, low-carb diet example.",
              "diets": {
                "Monday": {
                  "breakfast": {
                    "name": "Salmon Quinoa Bowl",
                    "ingredients": ["Salmon", "Quinoa", "Spinach"],
                    "description": "Nutritious bowl with salmon and quinoa.",
                    "nutrients": { "protein": 32, "carbs": 15, "fat": 8, "calories": 280 },
                    "reason": "Rich in protein and omega-3.",
                    "infoUrl": "https://www.youtube.com/results?search_query=Salmon+Quinoa+Bowl"
                  }
                }
              }
            }
            ⚠️ 화~금요일도 월요일과 같은 형식으로 작성하세요. 반드시 valid JSON만, 추가 설명 없이 출력하세요.
            """, bodyType, survey);

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", "식단 전문가로만 응답해 주세요. JSON만 출력합니다."),
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 3000,
                "temperature", 0.7
        );

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(resp -> {
                    @SuppressWarnings("unchecked")
                    List<Map<String,Object>> choices = (List<Map<String,Object>>) resp.get("choices");
                    Map<String,Object> message = (Map<String,Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    System.out.println("[AI 식단 추천 응답] " + content);
                    return content;
                });
    }

    // 키워드 추출
    public Mono<List<String>> getKeywordExtraction(String prompt) {
        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", "운동 전문가로만, JSON 배열로만 답변해 주세요."),
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 100
        );
        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(resp -> {
                    @SuppressWarnings("unchecked")
                    List<Map<String,Object>> choices = (List<Map<String,Object>>) resp.get("choices");
                    String content = (String)((Map<String,Object>)choices.get(0).get("message")).get("content");
                    try {
                        return Mono.just(mapper.readValue(content, new TypeReference<List<String>>(){}));
                    } catch (Exception e) {
                        return Mono.error(new RuntimeException("키워드 파싱 실패: " + e.getMessage()));
                    }
                });
    }
}
