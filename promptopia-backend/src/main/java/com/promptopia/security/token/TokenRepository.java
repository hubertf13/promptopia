package com.promptopia.security.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query(value = """
            select t from Token t inner join User u on t.user.id = u.id
            where u.id = :id and (t.expired = false or t.revoked = false)
            """)
    List<Token> findAllValidTokensByUser(Long id);

    Optional<Token> findByToken(String token);
}
