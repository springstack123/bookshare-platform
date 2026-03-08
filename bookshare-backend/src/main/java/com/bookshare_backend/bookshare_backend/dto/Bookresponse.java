package com.bookshare_backend.bookshare_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.entity.Book.BookCondition;
import com.bookshare_backend.bookshare_backend.entity.Book.BookStatus;
import com.bookshare_backend.bookshare_backend.entity.Book.ListingType;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Bookresponse {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String category;
    private String description;
    private String coverImageUrl;
    private Book.ListingType listingType;
    private BigDecimal price;
    private Book.BookStatus status;
    private Book.BookCondition condition;
    private String language;
    private Integer pages;
    private Integer publishedYear;
    private String city;
    private String area;
    private int viewCount;
    private int requestCount;
    private double avgRating;
    private int reviewCount;
    private OwnerSummary owner;
    private LocalDateTime createdAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OwnerSummary {
        private Long id;
        private String name;
        private String city;
        private double avgRating;
        private int totalReviews;
        private boolean verified;
    }

	public Bookresponse(String title, String author, String isbn, String category, String description,
			String coverImageUrl, ListingType listingType, BigDecimal price, BookStatus status, BookCondition condition,
			String language, Integer pages, Integer publishedYear, String city, String area, int viewCount,
			int requestCount, double avgRating, int reviewCount, OwnerSummary owner, LocalDateTime createdAt) {
		super();
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.category = category;
		this.description = description;
		this.coverImageUrl = coverImageUrl;
		this.listingType = listingType;
		this.price = price;
		this.status = status;
		this.condition = condition;
		this.language = language;
		this.pages = pages;
		this.publishedYear = publishedYear;
		this.city = city;
		this.area = area;
		this.viewCount = viewCount;
		this.requestCount = requestCount;
		this.avgRating = avgRating;
		this.reviewCount = reviewCount;
		this.owner = owner;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCoverImageUrl() {
		return coverImageUrl;
	}

	public void setCoverImageUrl(String coverImageUrl) {
		this.coverImageUrl = coverImageUrl;
	}

	public Book.ListingType getListingType() {
		return listingType;
	}

	public void setListingType(Book.ListingType listingType) {
		this.listingType = listingType;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Book.BookStatus getStatus() {
		return status;
	}

	public void setStatus(Book.BookStatus status) {
		this.status = status;
	}

	public Book.BookCondition getCondition() {
		return condition;
	}

	public void setCondition(Book.BookCondition condition) {
		this.condition = condition;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public Integer getPages() {
		return pages;
	}

	public void setPages(Integer pages) {
		this.pages = pages;
	}

	public Integer getPublishedYear() {
		return publishedYear;
	}

	public void setPublishedYear(Integer publishedYear) {
		this.publishedYear = publishedYear;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public int getViewCount() {
		return viewCount;
	}

	public void setViewCount(int viewCount) {
		this.viewCount = viewCount;
	}

	public int getRequestCount() {
		return requestCount;
	}

	public void setRequestCount(int requestCount) {
		this.requestCount = requestCount;
	}

	public double getAvgRating() {
		return avgRating;
	}

	public void setAvgRating(double avgRating) {
		this.avgRating = avgRating;
	}

	public int getReviewCount() {
		return reviewCount;
	}

	public void setReviewCount(int reviewCount) {
		this.reviewCount = reviewCount;
	}

	public OwnerSummary getOwner() {
		return owner;
	}

	public void setOwner(OwnerSummary owner) {
		this.owner = owner;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}