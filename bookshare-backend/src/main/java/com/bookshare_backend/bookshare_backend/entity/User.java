package com.bookshare_backend.bookshare_backend.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.bookshare_backend.bookshare_backend.dto.BookRequest;
import com.bookshare_backend.bookshare_backend.entity.Book;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String city;
    private String bio;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "is_verified")
    private boolean verified = false;

    @Column(name = "is_active")
    private boolean active = true;

    // Stats (denormalized for performance)
    @Column(name = "books_listed")
    private int booksListed = 0;

    @Column(name = "books_sold")
    private int booksSold = 0;

    @Column(name = "books_exchanged")
    private int booksExchanged = 0;

    @Column(name = "avg_rating")
    private double avgRating = 0.0;

    @Column(name = "total_reviews")
    private int totalReviews = 0;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Book> books;

    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookRequest> requests;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Role {
        USER, ADMIN
    }

	public User(String name, String email, String password, String phone, String city, String bio, String avatarUrl,
			Role role, boolean verified, boolean active, int booksListed, int booksSold, int booksExchanged,
			double avgRating, int totalReviews, List<Book> books, List<BookRequest> requests, LocalDateTime createdAt,
			LocalDateTime updatedAt) {
		super();
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.city = city;
		this.bio = bio;
		this.avatarUrl = avatarUrl;
		this.role = role;
		this.verified = verified;
		this.active = active;
		this.booksListed = booksListed;
		this.booksSold = booksSold;
		this.booksExchanged = booksExchanged;
		this.avgRating = avgRating;
		this.totalReviews = totalReviews;
		this.books = books;
		this.requests = requests;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getAvatarUrl() {
		return avatarUrl;
	}

	public void setAvatarUrl(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public int getBooksListed() {
		return booksListed;
	}

	public void setBooksListed(int booksListed) {
		this.booksListed = booksListed;
	}

	public int getBooksSold() {
		return booksSold;
	}

	public void setBooksSold(int booksSold) {
		this.booksSold = booksSold;
	}

	public int getBooksExchanged() {
		return booksExchanged;
	}

	public void setBooksExchanged(int booksExchanged) {
		this.booksExchanged = booksExchanged;
	}

	public double getAvgRating() {
		return avgRating;
	}

	public void setAvgRating(double avgRating) {
		this.avgRating = avgRating;
	}

	public int getTotalReviews() {
		return totalReviews;
	}

	public void setTotalReviews(int totalReviews) {
		this.totalReviews = totalReviews;
	}

	public List<Book> getBooks() {
		return books;
	}

	public void setBooks(List<Book> books) {
		this.books = books;
	}

	public List<BookRequest> getRequests() {
		return requests;
	}

	public void setRequests(List<BookRequest> requests) {
		this.requests = requests;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
    
}