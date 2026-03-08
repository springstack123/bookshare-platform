package com.bookshare_backend.bookshare_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookshare_backend.bookshare_backend.dto.Bookresponse;
import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.entity.User;
import com.bookshare_backend.bookshare_backend.entity.Wishlist;
import com.bookshare_backend.bookshare_backend.exception.Resourcenotfoundexception;
import com.bookshare_backend.bookshare_backend.repository.Bookrepository;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;
import com.bookshare_backend.bookshare_backend.repository.Wishlistrepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Wishlistservice {

    private final Wishlistrepository wishlistRepository;
    private final Bookrepository bookRepository;
    private final UserRepository userRepository;
    private final Bookservice bookService;

    // Add book to wishlist
    @Transactional
    public void add(Long bookId, String userEmail) {

        User user = findUser(userEmail);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Resourcenotfoundexception("Book not found"));

        if (wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new RuntimeException("Book already in wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .book(book)
                .build();

        wishlistRepository.save(wishlist);
    }

    // Remove book from wishlist
    @Transactional
    public void remove(Long bookId, String userEmail) {

        User user = findUser(userEmail);

        if (!wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new RuntimeException("Book not in wishlist");
        }

        wishlistRepository.deleteByUserIdAndBookId(user.getId(), bookId);
    }

    // Get user wishlist
    public List<Bookresponse> getMyWishlist(String userEmail) {

        User user = findUser(userEmail);

        return wishlistRepository
                .findByUserIdOrderByAddedAtDesc(user.getId())
                .stream()
                .map(w -> bookService.toResponse(w.getBook()))
                .toList();
    }

    // Check if book is wishlisted
    public boolean isWishlisted(Long bookId, String userEmail) {

        User user = findUser(userEmail);

        return wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId);
    }

    // Find user by email
    private User findUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new Resourcenotfoundexception("User not found"));
    }
}