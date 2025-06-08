package com.example.smart_healthcare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inbody_id")
    private InbodyRecord inbody;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id")
    private Survey survey;

    @Column(name = "body_type", length = 20)
    private String bodyType;

    @Column(name = "workout_json", columnDefinition = "json")
    private String workoutJson;

    @Column(name = "diet_json", columnDefinition = "json")
    private String dietJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public InbodyRecord getInbody() { return inbody; }
    public void setInbody(InbodyRecord inbody) { this.inbody = inbody; }

    public Survey getSurvey() { return survey; }
    public void setSurvey(Survey survey) { this.survey = survey; }

    public String getBodyType() { return bodyType; }
    public void setBodyType(String bodyType) { this.bodyType = bodyType; }

    public String getWorkoutJson() { return workoutJson; }
    public void setWorkoutJson(String workoutJson) { this.workoutJson = workoutJson; }

    public String getDietJson() { return dietJson; }
    public void setDietJson(String dietJson) { this.dietJson = dietJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}