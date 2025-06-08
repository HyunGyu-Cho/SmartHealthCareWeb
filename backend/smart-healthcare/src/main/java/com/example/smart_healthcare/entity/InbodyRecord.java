package com.example.smart_healthcare.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inbody_record")
public class InbodyRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime measuredAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender; // MALE, FEMALE

    private Integer birthYear;                // 사용자 출생년도
    private Float weight;                     // 체중
    private Float totalBodyWater;             // 총체수분
    private Float protein;                    // 단백질
    private Float mineral;                    // 무기질
    private Float bodyFatMass;                // 체지방량
    private Float muscleMass;                 // 근육량
    private Float fatFreeMass;                // 제지방량
    private Float skeletalMuscleMass;         // 골격근량
    private Float bodyFatPercentage;          // 체지방률
    private Float rightArmMuscleMass;         // 오른팔 근육량
    private Float leftArmMuscleMass;          // 왼팔 근육량
    private Float trunkMuscleMass;            // 몸통 근육량
    private Float rightLegMuscleMass;         // 오른다리 근육량
    private Float leftLegMuscleMass;          // 왼다리 근육량
    private Float rightArmFatMass;            // 오른팔 체지방량
    private Float leftArmFatMass;             // 왼팔 체지방량
    private Float trunkFatMass;               // 몸통 체지방량
    private Float rightLegFatMass;            // 오른다리 체지방량
    private Float leftLegFatMass;             // 왼다리 체지방량
    private Integer inbodyScore;              // 인바디점수
    private Float idealWeight;                // 적정체중
    private Float weightControl;              // 체중조절
    private Float fatControl;                 // 지방조절
    private Float muscleControl;              // 근육조절
    private Integer basalMetabolism;          // 기초대사량
    private Float abdominalFatPercentage;     // 복부지방률
    private Float visceralFatLevel;           // 내장지방레벨

    public Float getObesityDegree() {
        return obesityDegree;
    }

    public Float getVisceralFatLevel() {
        return visceralFatLevel;
    }

    public Float getAbdominalFatPercentage() {
        return abdominalFatPercentage;
    }

    public Integer getBasalMetabolism() {
        return basalMetabolism;
    }

    public Float getMuscleControl() {
        return muscleControl;
    }

    public Float getFatControl() {
        return fatControl;
    }

    public Float getWeightControl() {
        return weightControl;
    }

    public Float getIdealWeight() {
        return idealWeight;
    }

    public Integer getInbodyScore() {
        return inbodyScore;
    }

    public Float getLeftLegFatMass() {
        return leftLegFatMass;
    }

    public Float getRightLegFatMass() {
        return rightLegFatMass;
    }

    public Float getTrunkFatMass() {
        return trunkFatMass;
    }

    public Float getLeftArmFatMass() {
        return leftArmFatMass;
    }

    public Float getRightArmFatMass() {
        return rightArmFatMass;
    }

    public Float getLeftLegMuscleMass() {
        return leftLegMuscleMass;
    }

    public Float getRightLegMuscleMass() {
        return rightLegMuscleMass;
    }

    public Float getTrunkMuscleMass() {
        return trunkMuscleMass;
    }

    public Float getLeftArmMuscleMass() {
        return leftArmMuscleMass;
    }

    public Float getRightArmMuscleMass() {
        return rightArmMuscleMass;
    }

    public Float getBodyFatPercentage() {
        return bodyFatPercentage;
    }

    public Float getSkeletalMuscleMass() {
        return skeletalMuscleMass;
    }

    public Float getFatFreeMass() {
        return fatFreeMass;
    }

    public Float getMuscleMass() {
        return muscleMass;
    }

    public Float getBodyFatMass() {
        return bodyFatMass;
    }

    public Float getMineral() {
        return mineral;
    }

    public Float getProtein() {
        return protein;
    }

    public Float getTotalBodyWater() {
        return totalBodyWater;
    }

    public Float getWeight() {
        return weight;
    }

    public Integer getBirthYear() {
        return birthYear;
    }

    public Gender getGender() {
        return gender;
    }

    public LocalDateTime getMeasuredAt() {
        return measuredAt;
    }

    public User getUser() {
        return user;
    }

    public Long getId() {
        return id;
    }

    private Float obesityDegree;              // 비만도

    public enum Gender { MALE, FEMALE }


    public void setMineral(Float mineral) {
        this.mineral = mineral;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setMeasuredAt(LocalDateTime measuredAt) {
        this.measuredAt = measuredAt;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public void setBirthYear(Integer birthYear) {
        this.birthYear = birthYear;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public void setTotalBodyWater(Float totalBodyWater) {
        this.totalBodyWater = totalBodyWater;
    }

    public void setProtein(Float protein) {
        this.protein = protein;
    }

    public void setBodyFatMass(Float bodyFatMass) {
        this.bodyFatMass = bodyFatMass;
    }

    public void setMuscleMass(Float muscleMass) {
        this.muscleMass = muscleMass;
    }

    public void setFatFreeMass(Float fatFreeMass) {
        this.fatFreeMass = fatFreeMass;
    }

    public void setSkeletalMuscleMass(Float skeletalMuscleMass) {
        this.skeletalMuscleMass = skeletalMuscleMass;
    }

    public void setBodyFatPercentage(Float bodyFatPercentage) {
        this.bodyFatPercentage = bodyFatPercentage;
    }

    public void setRightArmMuscleMass(Float rightArmMuscleMass) {
        this.rightArmMuscleMass = rightArmMuscleMass;
    }

    public void setLeftArmMuscleMass(Float leftArmMuscleMass) {
        this.leftArmMuscleMass = leftArmMuscleMass;
    }

    public void setTrunkMuscleMass(Float trunkMuscleMass) {
        this.trunkMuscleMass = trunkMuscleMass;
    }

    public void setRightLegMuscleMass(Float rightLegMuscleMass) {
        this.rightLegMuscleMass = rightLegMuscleMass;
    }

    public void setLeftLegMuscleMass(Float leftLegMuscleMass) {
        this.leftLegMuscleMass = leftLegMuscleMass;
    }

    public void setRightArmFatMass(Float rightArmFatMass) {
        this.rightArmFatMass = rightArmFatMass;
    }

    public void setLeftArmFatMass(Float leftArmFatMass) {
        this.leftArmFatMass = leftArmFatMass;
    }

    public void setTrunkFatMass(Float trunkFatMass) {
        this.trunkFatMass = trunkFatMass;
    }

    public void setRightLegFatMass(Float rightLegFatMass) {
        this.rightLegFatMass = rightLegFatMass;
    }

    public void setLeftLegFatMass(Float leftLegFatMass) {
        this.leftLegFatMass = leftLegFatMass;
    }

    public void setInbodyScore(Integer inbodyScore) {
        this.inbodyScore = inbodyScore;
    }

    public void setIdealWeight(Float idealWeight) {
        this.idealWeight = idealWeight;
    }

    public void setWeightControl(Float weightControl) {
        this.weightControl = weightControl;
    }

    public void setFatControl(Float fatControl) {
        this.fatControl = fatControl;
    }

    public void setMuscleControl(Float muscleControl) {
        this.muscleControl = muscleControl;
    }

    public void setBasalMetabolism(Integer basalMetabolism) {
        this.basalMetabolism = basalMetabolism;
    }

    public void setAbdominalFatPercentage(Float abdominalFatPercentage) {
        this.abdominalFatPercentage = abdominalFatPercentage;
    }

    public void setVisceralFatLevel(Float visceralFatLevel) {
        this.visceralFatLevel = visceralFatLevel;
    }

    public void setObesityDegree(Float obesityDegree) {
        this.obesityDegree = obesityDegree;
    }
}