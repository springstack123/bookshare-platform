package com.bookshare_backend.bookshare_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.bookshare_backend.bookshare_backend.dto.BookRequest.RequestStatus;
import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.entity.Book.ListingType;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Requestresponse {
    private Long id;
    private Bookresponse book;
    private Userprofileresponse requester;
    private Userprofileresponse owner;
    private BookRequest.RequestStatus status;
    private Book.ListingType requestType;
    private String message;
    private String pickupPreference;
    private String exchangeBookTitle;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
	public Requestresponse(Bookresponse book, Userprofileresponse requester, Userprofileresponse owner,
			RequestStatus status, ListingType requestType, String message, String pickupPreference,
			String exchangeBookTitle, LocalDateTime createdAt, LocalDateTime resolvedAt) {
		super();
		this.book = book;
		this.requester = requester;
		this.owner = owner;
		this.status = status;
		this.requestType = requestType;
		this.message = message;
		this.pickupPreference = pickupPreference;
		this.exchangeBookTitle = exchangeBookTitle;
		this.createdAt = createdAt;
		this.resolvedAt = resolvedAt;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Bookresponse getBook() {
		return book;
	}
	public void setBook(Bookresponse book) {
		this.book = book;
	}
	public Userprofileresponse getRequester() {
		return requester;
	}
	public void setRequester(Userprofileresponse requester) {
		this.requester = requester;
	}
	public Userprofileresponse getOwner() {
		return owner;
	}
	public void setOwner(Userprofileresponse owner) {
		this.owner = owner;
	}
	public BookRequest.RequestStatus getStatus() {
		return status;
	}
	public void setStatus(BookRequest.RequestStatus status) {
		this.status = status;
	}
	public Book.ListingType getRequestType() {
		return requestType;
	}
	public void setRequestType(Book.ListingType requestType) {
		this.requestType = requestType;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getPickupPreference() {
		return pickupPreference;
	}
	public void setPickupPreference(String pickupPreference) {
		this.pickupPreference = pickupPreference;
	}
	public String getExchangeBookTitle() {
		return exchangeBookTitle;
	}
	public void setExchangeBookTitle(String exchangeBookTitle) {
		this.exchangeBookTitle = exchangeBookTitle;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getResolvedAt() {
		return resolvedAt;
	}
	public void setResolvedAt(LocalDateTime resolvedAt) {
		this.resolvedAt = resolvedAt;
	}
    
}