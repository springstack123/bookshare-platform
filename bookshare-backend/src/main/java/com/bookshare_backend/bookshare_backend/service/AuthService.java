package com.bookshare_backend.bookshare_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookshare_backend.bookshare_backend.dto.Authresponse;
import com.bookshare_backend.bookshare_backend.dto.Registerrequest;
import com.bookshare_backend.bookshare_backend.dto.Loginrequest;
import com.bookshare_backend.bookshare_backend.entity.User;
import com.bookshare_backend.bookshare_backend.exception.Badrequestexception;
import com.bookshare_backend.bookshare_backend.exception.Resourcenotfoundexception;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;
import com.bookshare_backend.bookshare_backend.security.Jwtutil;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository     userRepository;
    private final PasswordEncoder    passwordEncoder;
    private final Jwtutil            jwtUtil;
    private final AuthenticationManager authManager;

    // ── Register ─────────────────────────────────────────────────────────
    @Transactional
    public Authresponse register(Registerrequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new Badrequestexception("Email already registered: " + req.getEmail());
        }

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .phone(req.getPhone())
            .city(req.getCity())
            .role(User.Role.USER)
            .active(true)
            .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        return Authresponse.builder()
            .token(token)
            .type("Bearer")
            .userId(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .city(user.getCity())
            .role(user.getRole().name())
            .expiresAt(LocalDateTime.now().plusDays(1))
            .build();
    }

    // ── Login ─────────────────────────────────────────────────────────────
    public Authresponse login(Loginrequest req) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Badrequestexception("Invalid email or password");
        }

        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new Resourcenotfoundexception("User not found"));

        if (!user.isActive()) {
            throw new Badrequestexception("Account is deactivated");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        return Authresponse.builder()
            .token(token)
            .type("Bearer")
            .userId(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .city(user.getCity())
            .role(user.getRole().name())
            .expiresAt(LocalDateTime.now().plusDays(1))
            .build();
    }
}

