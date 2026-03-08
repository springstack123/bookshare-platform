package com.bookshare_backend.bookshare_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.bookshare_backend.bookshare_backend.dto.BookRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "books")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String isbn;
    private String category;
    private String description;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType;

    private BigDecimal price;   // null for borrow/exchange

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus status = BookStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_condition")
    private BookCondition condition = BookCondition.GOOD;

    private String language;
    private Integer pages;

    @Column(name = "published_year")
    private Integer publishedYear;

    // Location
    private String city;
    private String area;

    // Stats
    @Column(name = "view_count")
    private int viewCount = 0;

    @Column(name = "request_count")
    private int requestCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookRequest> requests;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ListingType {
        BORROW, EXCHANGE, SELL
    }

    public enum BookStatus {
        AVAILABLE, PENDING, BORROWED, SOLD, EXCHANGED, INACTIVE
    }

    public enum BookCondition {
        NEW, LIKE_NEW, GOOD, FAIR, POOR
    }
    
}