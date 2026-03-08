package com.bookshare_backend.bookshare_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Userprofileresponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String city;
    private String bio;
    private String avatarUrl;
    private boolean verified;
    private boolean active;
    private String role;
    private int booksListed;
    private int booksSold;
    private int booksExchanged;
    private double avgRating;
    private int totalReviews;
    private LocalDateTime createdAt;
	public Userprofileresponse(String name, String email, String phone, String city, String bio, String avatarUrl,
			boolean verified, String role, int booksListed, int booksSold, int booksExchanged, double avgRating,
			int totalReviews, LocalDateTime createdAt) {
		super();
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.city = city;
		this.bio = bio;
		this.avatarUrl = avatarUrl;
		this.verified = verified;
		this.role = role;
		this.booksListed = booksListed;
		this.booksSold = booksSold;
		this.booksExchanged = booksExchanged;
		this.avgRating = avgRating;
		this.totalReviews = totalReviews;
		this.createdAt = createdAt;
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
	public boolean isVerified() {
		return verified;
	}
	public void setVerified(boolean verified) {
		this.verified = verified;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
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
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
}