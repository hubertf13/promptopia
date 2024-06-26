package com.promptopia.controller;

import com.promptopia.model.Post;
import com.promptopia.security.user.User;
import com.promptopia.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/post")
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<Post> addPost(@RequestBody Post post, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        post.setUser(user);
        return ResponseEntity.ok(postService.addPost(post));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/all/user/{id}")
    public ResponseEntity<List<Post>> getAllUserPosts(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getAllUserPosts(id));
    }
}
