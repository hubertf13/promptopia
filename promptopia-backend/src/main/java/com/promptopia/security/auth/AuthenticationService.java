package com.promptopia.security.auth;

import com.promptopia.exception.EmailAlreadyExistsException;
import com.promptopia.exception.TokenIsNotValidException;
import com.promptopia.exception.UserNotFoundException;
import com.promptopia.exception.UsernameAlreadyExistsException;
import com.promptopia.security.config.JwtService;
import com.promptopia.security.token.Token;
import com.promptopia.security.token.TokenRepository;
import com.promptopia.security.token.TokenType;
import com.promptopia.security.user.Role;
import com.promptopia.security.user.User;
import com.promptopia.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        validateEmailAndUsernameNotExists(request.getEmail(), request.getUsername());
        validateEmailNotExists(request.getEmail());
        validateUsernameNotExists(request.getUsername());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);

        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private void revokeAllUserTokens(User user) {
        List<Token> validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return;
        }

        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private void validateEmailAndUsernameNotExists(String email, String username) {
        if (userRepository.findByEmail(email).isPresent() && userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyExistsException("Username and email already exists");
        }
    }

    private void validateUsernameNotExists(String username) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }
    }

    private void validateEmailNotExists(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
    }

    public Long getUserIdFromToken(String jwt) {
        Optional<Token> optionalToken = tokenRepository.findByToken(jwt);
        Boolean isTokenValid = optionalToken
                .map(token -> !token.isExpired() && !token.isRevoked())
                .orElse(false);

        if (!isTokenValid) {
            throw new TokenIsNotValidException("Unauthorized");
        }

        return optionalToken.get().getUser().getId();
    }
}
