package com.bookshare_backend.bookshare_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookshare_backend.bookshare_backend.dto.ApiResponse;
import com.bookshare_backend.bookshare_backend.dto.Authresponse;
import com.bookshare_backend.bookshare_backend.dto.Loginrequest;
import com.bookshare_backend.bookshare_backend.dto.Registerrequest;
import com.bookshare_backend.bookshare_backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class Authcontroller {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { name, email, password, phone, city }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Authresponse>> register(@Valid @RequestBody Registerrequest req) {
        Authresponse auth = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Account created successfully", auth));
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Authresponse>> login(@Valid @RequestBody Loginrequest req) {
        Authresponse auth = authService.login(req);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", auth));
    }
}