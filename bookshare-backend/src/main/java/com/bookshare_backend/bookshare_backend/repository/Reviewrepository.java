package com.bookshare_backend.bookshare_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bookshare_backend.bookshare_backend.entity.Review;

import java.util.List;

public interface Reviewrepository extends JpaRepository<Review, Long> {
    List<Review> findByBookId(Long bookId);
    List<Review> findByReviewedUserId(Long userId);
    boolean existsByBookIdAndReviewerId(Long bookId, Long reviewerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewedUser.id = :userId")
    Double findAvgRatingByUserId(@Param("userId") Long userId);
}








