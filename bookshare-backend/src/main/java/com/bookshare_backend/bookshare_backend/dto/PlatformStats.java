package com.bookshare_backend.bookshare_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PlatformStats {
    private long totalBooks;
    private long availableBooks;
    private long totalUsers;
    private long borrowBooks;
    private long sellBooks;
    private long exchangeBooks;
    private long totalRequests;
    private long completedRequests;
    private List<String> cities;
	public long getTotalBooks() {
		return totalBooks;
	}
	public void setTotalBooks(long totalBooks) {
		this.totalBooks = totalBooks;
	}
	public long getAvailableBooks() {
		return availableBooks;
	}
	public void setAvailableBooks(long availableBooks) {
		this.availableBooks = availableBooks;
	}
	public long getTotalUsers() {
		return totalUsers;
	}
	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}
	public long getBorrowBooks() {
		return borrowBooks;
	}
	public void setBorrowBooks(long borrowBooks) {
		this.borrowBooks = borrowBooks;
	}
	public long getSellBooks() {
		return sellBooks;
	}
	public void setSellBooks(long sellBooks) {
		this.sellBooks = sellBooks;
	}
	public long getExchangeBooks() {
		return exchangeBooks;
	}
	public void setExchangeBooks(long exchangeBooks) {
		this.exchangeBooks = exchangeBooks;
	}
	public long getTotalRequests() {
		return totalRequests;
	}
	public void setTotalRequests(long totalRequests) {
		this.totalRequests = totalRequests;
	}
	public long getCompletedRequests() {
		return completedRequests;
	}
	public void setCompletedRequests(long completedRequests) {
		this.completedRequests = completedRequests;
	}
	public List<String> getCities() {
		return cities;
	}
	public void setCities(List<String> cities) {
		this.cities = cities;
	}
    
}








