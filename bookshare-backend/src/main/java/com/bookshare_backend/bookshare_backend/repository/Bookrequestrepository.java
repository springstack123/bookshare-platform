package com.bookshare_backend.bookshare_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bookshare_backend.bookshare_backend.dto.BookRequest;

import java.util.List;

public interface Bookrequestrepository extends JpaRepository<BookRequest, Long> {
    Page<BookRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId, Pageable pageable);
    Page<BookRequest> findByOwnerIdOrderByCreatedAtDesc(Long ownerId, Pageable pageable);
    List<BookRequest> findByBookIdAndStatus(Long bookId, BookRequest.RequestStatus status);
    boolean existsByBookIdAndRequesterIdAndStatus(Long bookId, Long requesterId, BookRequest.RequestStatus status);
    long countByStatus(BookRequest.RequestStatus status);
}