package com.bookshare_backend.bookshare_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.bookshare_backend.bookshare_backend.dto.ApiResponse;
import com.bookshare_backend.bookshare_backend.dto.Bookresponse;
import com.bookshare_backend.bookshare_backend.dto.PlatformStats;
import com.bookshare_backend.bookshare_backend.dto.Userprofileresponse;
import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.entity.User;
import com.bookshare_backend.bookshare_backend.entity.User.Role;
import com.bookshare_backend.bookshare_backend.repository.Bookrepository;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;
import com.bookshare_backend.bookshare_backend.service.Bookservice;
import com.bookshare_backend.bookshare_backend.service.Statsservice;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final Bookrepository bookRepository;
    private final Statsservice statsService;
    private final Bookservice bookService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PlatformStats>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.ok(statsService.getPlatformStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<Userprofileresponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users;
        
        if (search != null && !search.isBlank()) {
            users = userRepository.findByEmailContaining(search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        Page<Userprofileresponse> response = users.map(this::toUserResponse);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Userprofileresponse>> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ApiResponse.ok(toUserResponse(user)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("User deactivated successfully", null));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<Userprofileresponse>> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            user.setRole(Role.valueOf(role.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok(toUserResponse(user)));
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<ApiResponse<Userprofileresponse>> toggleUserVerification(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerified(!user.isVerified());
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok(toUserResponse(user)));
    }

    @GetMapping("/books")
    public ResponseEntity<ApiResponse<Page<Bookresponse>>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findAllBooksForAdmin(search, status, pageable);
        
        Page<Bookresponse> response = books.map(bookService::toResponse);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Book deleted successfully", null));
    }

    private Userprofileresponse toUserResponse(User user) {
        return Userprofileresponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .city(user.getCity())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .verified(user.isVerified())
                .active(user.isActive())
                .booksListed(user.getBooksListed())
                .booksSold(user.getBooksSold())
                .booksExchanged(user.getBooksExchanged())
                .avgRating(user.getAvgRating())
                .totalReviews(user.getTotalReviews())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

