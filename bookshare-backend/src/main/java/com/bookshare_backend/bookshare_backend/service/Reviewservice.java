package com.bookshare_backend.bookshare_backend.service;

import lombok.RequiredArgsConstructor;

import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookshare_backend.bookshare_backend.dto.ReviewRequest;
import com.bookshare_backend.bookshare_backend.dto.ReviewResponse;
import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.entity.Review;
import com.bookshare_backend.bookshare_backend.entity.User;
import com.bookshare_backend.bookshare_backend.exception.Resourcenotfoundexception;
import com.bookshare_backend.bookshare_backend.repository.Bookrepository;
import com.bookshare_backend.bookshare_backend.repository.Reviewrepository;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;

import java.util.List;

import javax.management.relation.RelationNotFoundException;

@Service
@RequiredArgsConstructor
public class Reviewservice {

    private final Reviewrepository reviewRepository;
    private final Bookrepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse addReview(ReviewRequest req, String reviewerEmail) throws BadRequestException, RelationNotFoundException {

        User reviewer = findUser(reviewerEmail);

        Book book = bookRepository.findById(req.getBookId())
                .orElseThrow(() -> new RelationNotFoundException("Book not found"));

        if (book.getOwner().getId().equals(reviewer.getId())) {
            throw new BadRequestException("Cannot review your own book");
        }

        if (reviewRepository.existsByBookIdAndReviewerId(book.getId(), reviewer.getId())) {
            throw new BadRequestException("You have already reviewed this book");
        }

        Review review = Review.builder()
                .book(book)
                .reviewer(reviewer)
                .reviewedUser(book.getOwner())
                .rating(req.getRating())
                .comment(req.getComment())
                .reviewType(Review.ReviewType.BOOK)
                .build();

        review = reviewRepository.save(review);

        User owner = book.getOwner();
        Double avg = reviewRepository.findAvgRatingByUserId(owner.getId());

        owner.setAvgRating(avg != null ? avg : req.getRating());
        owner.setTotalReviews(owner.getTotalReviews() + 1);

        userRepository.save(owner);

        return toResponse(review);
    }

    public List<ReviewResponse> getBookReviews(Long bookId) {
        return reviewRepository.findByBookId(bookId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new Resourcenotfoundexception("User not found"));
    }
    private ReviewResponse toResponse(Review r) {

        return ReviewResponse.builder()
                .id(r.getId())
                .reviewerId(r.getReviewer().getId())
                .reviewerName(r.getReviewer().getName())
                .reviewerCity(r.getReviewer().getCity())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}