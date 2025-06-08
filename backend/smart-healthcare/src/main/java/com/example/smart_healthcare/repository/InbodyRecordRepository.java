package com.example.smart_healthcare.repository;

import com.example.smart_healthcare.entity.InbodyRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InbodyRecordRepository extends JpaRepository<InbodyRecord, Long> {
}