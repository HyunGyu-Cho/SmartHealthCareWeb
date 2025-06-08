package com.example.smart_healthcare.service;

import com.example.smart_healthcare.entity.FoodImageCache;
import com.example.smart_healthcare.repository.FoodImageCacheRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

@Service
public class ImageService {
    private final FoodImageCacheRepository cacheRepo;
    private final WebClient webClient;
    private final String unsplashAccessKey;

    public ImageService(FoodImageCacheRepository cacheRepo,
                        @Value("${unsplash.access.key}") String key) {
        this.cacheRepo = cacheRepo;
        this.unsplashAccessKey = key;
        this.webClient = WebClient.builder()
            .baseUrl("https://api.unsplash.com")
            .build();
    }

    /**
     * On-demand 이미지 URL 반환 (캐싱)
     */
    public Mono<String> getImageUrl(String foodName) {
        return Mono.justOrEmpty(cacheRepo.findById(foodName))
            .map(FoodImageCache::getImageUrl)
            .switchIfEmpty(fetchFromApi(foodName)
                .flatMap(url -> {
                    cacheRepo.save(new FoodImageCache(foodName, url));
                    return Mono.just(url);
                })
            );
    }

    private Mono<String> fetchFromApi(String foodName) {
        return webClient.get()
            .uri(uri -> uri.path("/search/photos")
                .queryParam("query", foodName)
                .queryParam("per_page", 1)
                .queryParam("client_id", unsplashAccessKey)
                .build())
            .retrieve()
            .bodyToMono(Map.class)
            .flatMap(map -> {
                var results = (List<Map<String,Object>>) map.get("results");
                if (results == null || results.isEmpty()) return Mono.error(new RuntimeException("No image"));
                Map<String,String> urls = (Map<String,String>) results.get(0).get("urls");
                return Mono.just(urls.get("regular"));
            });
    }
} 