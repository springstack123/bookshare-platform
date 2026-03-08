package com.bookshare_backend.bookshare_backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.bookshare_backend.bookshare_backend.dto.ApiResponse;
import com.bookshare_backend.bookshare_backend.dto.Bookcreaterequest;
import com.bookshare_backend.bookshare_backend.dto.Bookresponse;
import com.bookshare_backend.bookshare_backend.service.Bookservice;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class Bookcontroller {

    private final Bookservice bookService;

    // Browse books
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Bookresponse>>> browse(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort) {

        return ResponseEntity.ok(
                ApiResponse.ok(bookService.browse(city, category, type, search, page, size, sort)));
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Bookresponse>> getById(@PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok(bookService.getById(id)));
    }

    // Get my books
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Bookresponse>>> getMyBooks(
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok(bookService.getMyBooks(user.getUsername())));
    }

    // Get cities
    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<List<String>>> getCities() {

        return ResponseEntity.ok(
                ApiResponse.ok(bookService.getCities()));
    }

    // Create book
    @PostMapping
    public ResponseEntity<ApiResponse<Bookresponse>> create(
            @Valid @RequestBody Bookcreaterequest req,
            @AuthenticationPrincipal UserDetails user) {

        Bookresponse created = bookService.create(req, user.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Book listed successfully", created));
    }

    // Update book
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Bookresponse>> update(
            @PathVariable Long id,
            @RequestBody Bookcreaterequest req,
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(
                ApiResponse.ok("Book updated",
                        bookService.update(id, req, user.getUsername())));
    }

    // Delete book
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {

        bookService.delete(id, user.getUsername());

        return ResponseEntity.ok(
                ApiResponse.ok("Book removed", null));
    }
}