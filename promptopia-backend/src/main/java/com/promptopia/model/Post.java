package com.promptopia.model;

import com.promptopia.security.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    public void deleteHashtagsFromTag() {
        this.tag = this.tag.replaceAll("#", "");
    }
}
