package com.bookshare_backend.bookshare_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.bookshare_backend.bookshare_backend.dto.PlatformStats;
import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.repository.Bookrepository;
import com.bookshare_backend.bookshare_backend.repository.Bookrequestrepository;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;
import com.bookshare_backend.bookshare_backend.dto.BookRequest;
@Service
@RequiredArgsConstructor
public class Statsservice {

    private final Bookrepository bookRepository;
    private final UserRepository userRepository;
    private final Bookrequestrepository requestRepository;

    public PlatformStats getPlatformStats() {

        return PlatformStats.builder()
                .totalBooks(bookRepository.count())
                .availableBooks(bookRepository.countByStatus(Book.BookStatus.AVAILABLE))
                .totalUsers(userRepository.countActiveUsers())
                .borrowBooks(bookRepository.countByListingType(Book.ListingType.BORROW))
                .sellBooks(bookRepository.countByListingType(Book.ListingType.SELL))
                .exchangeBooks(bookRepository.countByListingType(Book.ListingType.EXCHANGE))
                .totalRequests(requestRepository.count())
                .completedRequests(requestRepository.countByStatus(BookRequest.RequestStatus.COMPLETED))
                .cities(bookRepository.findDistinctCities())
                .build();
    }
}