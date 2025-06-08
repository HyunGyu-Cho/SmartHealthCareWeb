package com.example.smart_healthcare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class RecommendRequest {
    @JsonProperty("inbody")
    private Map<String, Object> inbody;

    @JsonProperty("survey")
    private String survey;

    public RecommendRequest() {}

    public Map<String, Object> getInbody() {
        return inbody;
    }
    public void setInbody(Map<String, Object> inbody) {
        this.inbody = inbody;
    }

    public String getSurvey() {
        return survey;
    }
    public void setSurvey(String survey) {
        this.survey = survey;
    }
}
