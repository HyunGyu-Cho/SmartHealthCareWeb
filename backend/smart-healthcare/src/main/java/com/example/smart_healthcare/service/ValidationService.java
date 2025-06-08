// ValidationService.java
package com.example.smart_healthcare.service;

import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ValidationService {
    public static Mono<Map<String, Object>> validate(Map<String, Object> body,
                                                     List<String> features) {
        Map<String, Object> inbody = new HashMap<>();
        for (String f : features) {
            Object v = body.get(f);
            if (v == null) {
                return Mono.error(new IllegalArgumentException(f + " 필드가 없습니다."));
            }
            inbody.put(f, v);
        }
        return Mono.just(inbody);
    }
}