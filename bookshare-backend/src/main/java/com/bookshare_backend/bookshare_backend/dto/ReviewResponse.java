package com.bookshare_backend.bookshare_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerCity;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
	public ReviewResponse(Long reviewerId, String reviewerName, String reviewerCity, int rating, String comment,
			LocalDateTime createdAt) {
		super();
		this.reviewerId = reviewerId;
		this.reviewerName = reviewerName;
		this.reviewerCity = reviewerCity;
		this.rating = rating;
		this.comment = comment;
		this.createdAt = createdAt;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getReviewerId() {
		return reviewerId;
	}
	public void setReviewerId(Long reviewerId) {
		this.reviewerId = reviewerId;
	}
	public String getReviewerName() {
		return reviewerName;
	}
	public void setReviewerName(String reviewerName) {
		this.reviewerName = reviewerName;
	}
	public String getReviewerCity() {
		return reviewerCity;
	}
	public void setReviewerCity(String reviewerCity) {
		this.reviewerCity = reviewerCity;
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
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}








