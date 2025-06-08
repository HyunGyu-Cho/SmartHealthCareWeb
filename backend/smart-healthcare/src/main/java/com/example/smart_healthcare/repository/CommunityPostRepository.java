package com.example.smart_healthcare.repository;

import com.example.smart_healthcare.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findByTitleContaining(String keyword);
} 