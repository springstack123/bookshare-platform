package com.bookshare_backend.bookshare_backend.repository;

import com.bookshare_backend.bookshare_backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Wishlistrepository extends JpaRepository<Wishlist, Long> {

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    void deleteByUserIdAndBookId(Long userId, Long bookId);

    List<Wishlist> findByUserIdOrderByAddedAtDesc(Long userId);
}


