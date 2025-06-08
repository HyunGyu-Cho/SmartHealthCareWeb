// src/main/java/com/example/smart_healthcare/dto/BodyTypeDto.java
package com.example.smart_healthcare.dto;

public class BodyTypeDto {
    private String bodyType;
    private String summary;
    private String error;

    // 분류 결과용 생성자
    public BodyTypeDto(String bodyType, String summary) {
        this.bodyType = bodyType;
        this.summary = summary;
    }

    // 기본 생성자 (Jackson용)
    public BodyTypeDto() {}

    // 오류용 팩토리 메서드
    public static BodyTypeDto error(String errorMessage) {
        BodyTypeDto dto = new BodyTypeDto();
        dto.error = errorMessage;
        return dto;
    }

    // getters & setters
    public String getBodyType() {
        return bodyType;
    }
    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }
    public String getSummary() {
        return summary;
    }
    public void setSummary(String summary) {
        this.summary = summary;
    }
    public String getError() {
        return error;
    }
    public void setError(String error) {
        this.error = error;
    }
}
