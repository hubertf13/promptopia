package com.promptopia.model;

import com.promptopia.security.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    private String prompt;
    private String tag;
    @ManyToOne
    private User user;
}
