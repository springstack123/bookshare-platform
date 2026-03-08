package com.bookshare_backend.bookshare_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_user_id")
    private User reviewedUser;  // owner being reviewed

    @Column(nullable = false)
    private int rating;  // 1-5

    private String comment;

    @Column(name = "review_type")
    @Enumerated(EnumType.STRING)
    private ReviewType reviewType;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum ReviewType {
        BOOK, USER
    }

	public Review(Book book, User reviewer, User reviewedUser, int rating, String comment, ReviewType reviewType,
			LocalDateTime createdAt) {
		super();
		this.book = book;
		this.reviewer = reviewer;
		this.reviewedUser = reviewedUser;
		this.rating = rating;
		this.comment = comment;
		this.reviewType = reviewType;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public User getReviewer() {
		return reviewer;
	}

	public void setReviewer(User reviewer) {
		this.reviewer = reviewer;
	}

	public User getReviewedUser() {
		return reviewedUser;
	}

	public void setReviewedUser(User reviewedUser) {
		this.reviewedUser = reviewedUser;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public ReviewType getReviewType() {
		return reviewType;
	}

	public void setReviewType(ReviewType reviewType) {
		this.reviewType = reviewType;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
}