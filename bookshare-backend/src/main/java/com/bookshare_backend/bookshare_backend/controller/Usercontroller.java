package com.bookshare_backend.bookshare_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.bookshare_backend.bookshare_backend.dto.ApiResponse;
import com.bookshare_backend.bookshare_backend.dto.Changepasswordrequest;
import com.bookshare_backend.bookshare_backend.dto.Updateprofilerequest;
import com.bookshare_backend.bookshare_backend.dto.Userprofileresponse;
import com.bookshare_backend.bookshare_backend.service.Userservice;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class Usercontroller {

    private final Userservice userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Userprofileresponse>> getMe(
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok(userService.getProfile(user.getUsername())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Userprofileresponse>> getById(@PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok(userService.getProfileById(id)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Userprofileresponse>> updateProfile(
            @RequestBody Updateprofilerequest req,
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok("Profile updated",
                        userService.updateProfile(user.getUsername(), req)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody Changepasswordrequest req,
            @AuthenticationPrincipal UserDetails user) {

        userService.changePassword(user.getUsername(), req);

        return ResponseEntity.ok(
                ApiResponse.ok("Password changed successfully", null));
    }
}