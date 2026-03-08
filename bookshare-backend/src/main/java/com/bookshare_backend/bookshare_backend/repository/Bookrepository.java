package com.bookshare_backend.bookshare_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bookshare_backend.bookshare_backend.entity.Book;

import java.util.List;

public interface Bookrepository extends JpaRepository<Book, Long> {

    // Browse with filters
    @Query("""
        SELECT b FROM Book b
        WHERE b.status = 'AVAILABLE'
        AND (:city IS NULL OR LOWER(b.city) LIKE LOWER(CONCAT('%', :city, '%')))
        AND (:category IS NULL OR b.category = :category)
        AND (:type IS NULL OR b.listingType = :type)
        AND (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY b.createdAt DESC
    """)
    Page<Book> findWithFilters(
        @Param("city") String city,
        @Param("category") String category,
        @Param("type") Book.ListingType type,
        @Param("search") String search,
        Pageable pageable
    );

    // Owner books
    List<Book> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    Page<Book> findByOwnerIdOrderByCreatedAtDesc(Long ownerId, Pageable pageable);

    // Admin - find all books including inactive
    @Query("""
        SELECT b FROM Book b
        WHERE (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:status IS NULL OR b.status = :status)
        ORDER BY b.createdAt DESC
    """)
    Page<Book> findAllBooksForAdmin(
        @Param("search") String search,
        @Param("status") String status,
        Pageable pageable
    );

    // Featured / recent
    Page<Book> findByStatusOrderByCreatedAtDesc(Book.BookStatus status, Pageable pageable);

    // Stats
    long countByStatus(Book.BookStatus status);

    long countByListingType(Book.ListingType type);

    // View count
    @Modifying
    @Query("UPDATE Book b SET b.viewCount = b.viewCount + 1 WHERE b.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // Distinct cities
    @Query("SELECT DISTINCT b.city FROM Book b WHERE b.status = 'AVAILABLE' AND b.city IS NOT NULL ORDER BY b.city")
    List<String> findDistinctCities();
}