package com.bookshare_backend.bookshare_backend.service;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bookshare_backend.bookshare_backend.dto.Changepasswordrequest;
import com.bookshare_backend.bookshare_backend.dto.Updateprofilerequest;
import com.bookshare_backend.bookshare_backend.dto.Userprofileresponse;
import com.bookshare_backend.bookshare_backend.entity.User;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class Userservice {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ───── Get profile by email ─────
    public Userprofileresponse getProfile(String email) {
        return toResponse(findByEmail(email));
    }

    // ───── Get profile by ID ─────
    public Userprofileresponse getProfileById(Long id) {
        return toResponse(findById(id));
    }

    // ───── Update profile ─────
    @Transactional
    public Userprofileresponse updateProfile(String email, Updateprofilerequest req) {

        User user = findByEmail(email);

        if (req.getName() != null) {
            user.setName(req.getName());
        }

        if (req.getPhone() != null) {
            user.setPhone(req.getPhone());
        }

        if (req.getCity() != null) {
            user.setCity(req.getCity());
        }

        if (req.getBio() != null) {
            user.setBio(req.getBio());
        }

        userRepository.save(user);

        return toResponse(user);
    }

    // ───── Change password ─────
    @Transactional
    public void changePassword(String email, Changepasswordrequest req) {

        User user = findByEmail(email);

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));

        userRepository.save(user);
    }

    // ───── Helper: Find user by email ─────
    private User findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + email));
    }

    // ───── Helper: Find user by ID ─────
    private User findById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id));
    }

    // ───── Convert Entity → Response DTO ─────
    public Userprofileresponse toResponse(User user) {

        return Userprofileresponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .city(user.getCity())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .verified(user.isVerified())
                .role(user.getRole().name())
                .booksListed(user.getBooksListed())
                .booksSold(user.getBooksSold())
                .booksExchanged(user.getBooksExchanged())
                .avgRating(user.getAvgRating())
                .totalReviews(user.getTotalReviews())
                .createdAt(user.getCreatedAt())
                .build();
    }
}