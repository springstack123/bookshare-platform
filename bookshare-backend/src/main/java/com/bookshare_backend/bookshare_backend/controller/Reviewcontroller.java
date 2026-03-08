package com.bookshare_backend.bookshare_backend.controller;

import java.util.List;

import javax.management.relation.RelationNotFoundException;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.bookshare_backend.bookshare_backend.dto.ApiResponse;
import com.bookshare_backend.bookshare_backend.dto.ReviewRequest;
import com.bookshare_backend.bookshare_backend.dto.ReviewResponse;
import com.bookshare_backend.bookshare_backend.service.Reviewservice;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class Reviewcontroller {

    private final Reviewservice reviewService;

    @GetMapping("/book/{bookId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getBookReviews(
            @PathVariable Long bookId) {

        return ResponseEntity.ok(
                ApiResponse.ok(reviewService.getBookReviews(bookId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @Valid @RequestBody ReviewRequest req,
            @AuthenticationPrincipal UserDetails user) throws RelationNotFoundException, BadRequestException {

        ReviewResponse review = reviewService.addReview(req, user.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Review submitted", review));
    }
}