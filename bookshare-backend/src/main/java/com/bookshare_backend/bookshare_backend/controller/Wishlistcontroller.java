package com.bookshare_backend.bookshare_backend.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.bookshare_backend.bookshare_backend.dto.Bookresponse;
import com.bookshare_backend.bookshare_backend.service.Wishlistservice;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class Wishlistcontroller {

    private final Wishlistservice wishlistService;

    // Add to wishlist
    @PostMapping("/{bookId}")
    public void addToWishlist(@PathVariable Long bookId,
                              Authentication authentication) {

        wishlistService.add(bookId, authentication.getName());
    }

    // Remove from wishlist
    @DeleteMapping("/{bookId}")
    public void removeFromWishlist(@PathVariable Long bookId,
                                   Authentication authentication) {

        wishlistService.remove(bookId, authentication.getName());
    }

    // Get wishlist
    @GetMapping
    public List<Bookresponse> getWishlist(Authentication authentication) {

        return wishlistService.getMyWishlist(authentication.getName());
    }

    // Check if wishlisted
    @GetMapping("/check/{bookId}")
    public boolean isWishlisted(@PathVariable Long bookId,
                                Authentication authentication) {

        return wishlistService.isWishlisted(bookId, authentication.getName());
    }
}