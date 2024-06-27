package com.promptopia.service;

import com.promptopia.exception.PostNotFoundException;
import com.promptopia.exception.UnauthorizedOperationException;
import com.promptopia.model.Post;
import com.promptopia.repository.PostRepository;
import com.promptopia.security.facade.AuthenticationFacade;
import com.promptopia.security.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {
    private final PostRepository postRepository;
    private final AuthenticationFacade authenticationFacade;

    public Post findById(Long id) {
        log.info("Finding post by ID: {}", id);
        return postRepository.findById(id).orElseThrow(() -> {
            log.warn("Post not found with ID: {}", id);
            return new PostNotFoundException("Post not found");
        });
    }

    public Post addPost(Post post) {
        log.info("Adding post: {}", post);

        User user = (User) authenticationFacade.getAuthentication().getPrincipal();
        post.setUser(user);
        post.deleteHashtagsFromTag();

        return postRepository.save(post);
    }

    public List<Post> findAll() {
        List<Post> posts = postRepository.findAll();
        log.info("Finding all posts");
        return posts;
    }

    public List<Post> findPostsByUserId(Long id) {
        List<Post> posts = postRepository.findPostsByUserId(id);
        log.info("Finding posts by user ID: {}", id);
        return posts;
    }

    public Post updatePost(Long id, Post updatedPost) {
        Post existingPost = getExistingPost(id);

        String authenticatedUserEmail = authenticationFacade.getAuthentication().getName();
        String postOwnerEmail = existingPost.getUser().getEmail();

        if (authenticatedUserEmail.equals(postOwnerEmail)) {
            existingPost.setPrompt(updatedPost.getPrompt());
            existingPost.setTag(updatedPost.getTag());
            existingPost.deleteHashtagsFromTag();
            log.info("Updating post with ID: {}", id);
            return postRepository.save(existingPost);
        } else {
            log.warn(
                    "The owner of the post is a user with email: {}. Attempted event modification by user with email: {}",
                    postOwnerEmail,
                    authenticatedUserEmail);
            throw new UnauthorizedOperationException(
                    "You are not the owner of this post. You do not have permission to update it");
        }
    }

    public void deleteById(Long id) {
        Post existingPost = getExistingPost(id);

        String authenticatedUserEmail = authenticationFacade.getAuthentication().getName();
        String postOwnerEmail = existingPost.getUser().getEmail();

        if (authenticatedUserEmail.equals(postOwnerEmail)) {
            log.info("Deleting event by ID: {}", id);
            postRepository.deleteById(id);
        } else {
            log.warn(
                    "The owner of the event is a user with email: {}. Attempted event deletion by user with email: {}",
                    postOwnerEmail,
                    authenticatedUserEmail);
            throw new UnauthorizedOperationException(
                    "You are not the owner of this post. You do not have permission to delete it.");
        }
    }

    private Post getExistingPost(Long id) {
        return postRepository.findById(id).orElseThrow(() -> {
            log.warn("Post not found with ID: {}", id);
            return new PostNotFoundException("Post not found with id: " + id);
        });
    }
}
