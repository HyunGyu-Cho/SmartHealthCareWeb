package com.example.smart_healthcare.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "survey")
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "inbody_id")
    private InbodyRecord inbody;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public InbodyRecord getInbody() {
        return inbody;
    }

    public String getAnswerText() {
        return answerText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public void setInbody(InbodyRecord inbody) {
        this.inbody = inbody;
    }

    public void setUser(User user) {
        this.user = user;
    }
}