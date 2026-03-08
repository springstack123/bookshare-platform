package com.bookshare_backend.bookshare_backend.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookshare_backend.bookshare_backend.dto.ApiResponse;
import com.bookshare_backend.bookshare_backend.dto.PlatformStats;
import com.bookshare_backend.bookshare_backend.service.Statsservice;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Statscontroller {

    private final Statsservice statsService;

    /**
     * GET /api/stats
     * Public — platform-level numbers for homepage
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PlatformStats>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(statsService.getPlatformStats()));
    }
}