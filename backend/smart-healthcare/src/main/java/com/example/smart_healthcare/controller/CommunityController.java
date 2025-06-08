package com.example.smart_healthcare.controller;

import com.example.smart_healthcare.entity.*;
import com.example.smart_healthcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {
    private final CommunityPostRepository postRepo;
    private final CommentRepository commentRepo;

    // 글 목록
    @GetMapping
    public List<CommunityPost> list(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty())
            return postRepo.findByTitleContaining(search);
        return postRepo.findAll();
    }

    // 글 상세
    @GetMapping("/{id}")
    public CommunityPost detail(@PathVariable Long id) {
        return postRepo.findById(id).orElseThrow();
    }

    // 글 작성 (누구나)
    @PostMapping
    public CommunityPost create(@RequestBody CommunityPost post) {
        post.setCreatedAt(new Date());
        // author는 null
        return postRepo.save(post);
    }

    // 글 수정 (누구나)
    @PutMapping("/{id}")
    public CommunityPost update(@PathVariable Long id, @RequestBody CommunityPost req) {
        CommunityPost post = postRepo.findById(id).orElseThrow();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        return postRepo.save(post);
    }

    // 글 삭제 (누구나)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        postRepo.deleteById(id);
    }

    // 댓글 목록
    @GetMapping("/{postId}/comments")
    public List<Comment> comments(@PathVariable Long postId) {
        return commentRepo.findByPostId(postId);
    }

    // 댓글 작성 (누구나)
    @PostMapping("/{postId}/comments")
    public Comment addComment(@PathVariable Long postId, @RequestBody Comment comment) {
        CommunityPost post = postRepo.findById(postId).orElseThrow();
        comment.setPost(post);
        comment.setCreatedAt(new Date());
        // 대댓글(부모 댓글) 처리
        if (comment.getParentId() != null) {
            Comment parent = commentRepo.findById(comment.getParentId()).orElseThrow();
            comment.setParent(parent);
        }
        return commentRepo.save(comment);
    }

    // 댓글 삭제 (누구나)
    @DeleteMapping("/comments/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentRepo.deleteById(commentId);
    }
} 