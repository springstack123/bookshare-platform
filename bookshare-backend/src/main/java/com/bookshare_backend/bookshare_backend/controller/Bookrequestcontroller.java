package com.bookshare_backend.bookshare_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.bookshare_backend.bookshare_backend.dto.ApiResponse;
import com.bookshare_backend.bookshare_backend.dto.Requestcreatedto;
import com.bookshare_backend.bookshare_backend.dto.Requestresponse;
import com.bookshare_backend.bookshare_backend.service.Bookrequestservice;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class Bookrequestcontroller {

    private final Bookrequestservice requestService;

    @PostMapping
    public ResponseEntity<ApiResponse<Requestresponse>> create(
            @Valid @RequestBody Requestcreatedto dto,
            @AuthenticationPrincipal UserDetails user) {

        Requestresponse res = requestService.create(dto, user.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Request sent successfully", res));
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<Page<Requestresponse>>> getSent(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.ok(requestService.getMySent(user.getUsername(), page, size)));
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<Page<Requestresponse>>> getReceived(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.ok(requestService.getMyReceived(user.getUsername(), page, size)));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<Requestresponse>> accept(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok("Request accepted", requestService.accept(id, user.getUsername())));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Requestresponse>> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok("Request rejected", requestService.reject(id, user.getUsername())));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Requestresponse>> complete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok("Marked as completed", requestService.complete(id, user.getUsername())));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Requestresponse>> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok("Request cancelled", requestService.cancel(id, user.getUsername())));
    }
}