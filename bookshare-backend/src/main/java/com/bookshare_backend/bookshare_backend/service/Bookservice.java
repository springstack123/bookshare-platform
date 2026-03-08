package com.bookshare_backend.bookshare_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookshare_backend.bookshare_backend.dto.Bookcreaterequest;
import com.bookshare_backend.bookshare_backend.dto.Bookresponse;
import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.entity.User;
import com.bookshare_backend.bookshare_backend.exception.Badrequestexception;
import com.bookshare_backend.bookshare_backend.exception.Forbiddenexception;
import com.bookshare_backend.bookshare_backend.exception.Resourcenotfoundexception;
import com.bookshare_backend.bookshare_backend.repository.Bookrepository;
import com.bookshare_backend.bookshare_backend.repository.Reviewrepository;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Bookservice {

    private final Bookrepository   bookRepository;
    private final UserRepository   userRepository;
    private final Reviewrepository reviewRepository;

    // ── Browse with filters (public) ─────────────────────────────────────
    public Page<Bookresponse> browse(String city, String category, String type,
                                     String search, int page, int size, String sort) {
        Book.ListingType listingType = null;
        if (type != null && !type.isBlank()) {
            try { listingType = Book.ListingType.valueOf(type.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        Pageable pageable = PageRequest.of(page, size, resolveSort(sort));
        Page<Book> books = bookRepository.findWithFilters(
            (city != null && city.isBlank()) ? null : city,
            (category != null && category.isBlank()) ? null : category,
            listingType,
            (search != null && search.isBlank()) ? null : search,
            pageable
        );

        return books.map(this::toResponse);
    }

    // ── Get single book ───────────────────────────────────────────────────
    @Transactional
    public Bookresponse getById(Long id) {
        Book book = findOrThrow(id);
        bookRepository.incrementViewCount(id);
        return toResponse(book);
    }

    // ── Create ────────────────────────────────────────────────────────────
    @Transactional
    public Bookresponse create(Bookcreaterequest req, String ownerEmail) {
        User owner = findUserByEmail(ownerEmail);

        // SELL must have price
        if (req.getListingType() == Book.ListingType.SELL && req.getPrice() == null) {
            throw new Badrequestexception("Price is required for sell listings");
        }

        Book book = Book.builder()
            .title(req.getTitle())
            .author(req.getAuthor())
            .isbn(req.getIsbn())
            .category(req.getCategory())
            .description(req.getDescription())
            .listingType(req.getListingType())
            .price(req.getListingType() == Book.ListingType.SELL ? req.getPrice() : null)
            .condition(req.getCondition() != null ? req.getCondition() : Book.BookCondition.GOOD)
            .language(req.getLanguage() != null ? req.getLanguage() : "English")
            .pages(req.getPages())
            .publishedYear(req.getPublishedYear())
            .city(req.getCity())
            .area(req.getArea())
            .status(Book.BookStatus.AVAILABLE)
            .owner(owner)
            .build();

        book = bookRepository.save(book);

        // Update user stats
        owner.setBooksListed(owner.getBooksListed() + 1);
        userRepository.save(owner);

        return toResponse(book);
    }

    // ── Update ────────────────────────────────────────────────────────────
    @Transactional
    public Bookresponse update(Long id, Bookcreaterequest req, String ownerEmail) {
        Book book = findOrThrow(id);
        verifyOwner(book, ownerEmail);

        if (req.getTitle()        != null) book.setTitle(req.getTitle());
        if (req.getAuthor()       != null) book.setAuthor(req.getAuthor());
        if (req.getIsbn()         != null) book.setIsbn(req.getIsbn());
        if (req.getCategory()     != null) book.setCategory(req.getCategory());
        if (req.getDescription()  != null) book.setDescription(req.getDescription());
        if (req.getListingType()  != null) book.setListingType(req.getListingType());
        if (req.getPrice()        != null) book.setPrice(req.getPrice());
        if (req.getCondition()    != null) book.setCondition(req.getCondition());
        if (req.getLanguage()     != null) book.setLanguage(req.getLanguage());
        if (req.getPages()        != null) book.setPages(req.getPages());
        if (req.getPublishedYear()!= null) book.setPublishedYear(req.getPublishedYear());
        if (req.getCity()         != null) book.setCity(req.getCity());
        if (req.getArea()         != null) book.setArea(req.getArea());

        return toResponse(bookRepository.save(book));
    }

    // ── Delete ────────────────────────────────────────────────────────────
    @Transactional
    public void delete(Long id, String ownerEmail) {
        Book book = findOrThrow(id);
        verifyOwner(book, ownerEmail);
        book.setStatus(Book.BookStatus.INACTIVE);
        bookRepository.save(book);
    }

    // ── My books ──────────────────────────────────────────────────────────
    public List<Bookresponse> getMyBooks(String email) {
        User user = findUserByEmail(email);
        return bookRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId())
            .stream().map(this::toResponse).toList();
    }

    // ── Cities list ───────────────────────────────────────────────────────
    public List<String> getCities() {
        return bookRepository.findDistinctCities();
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    private Book findOrThrow(Long id) {
        return bookRepository.findById(id)
            .orElseThrow(() -> new Resourcenotfoundexception("Book not found: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new Resourcenotfoundexception("User not found: " + email));
    }

    private void verifyOwner(Book book, String email) {
        if (!book.getOwner().getEmail().equals(email)) {
            throw new Forbiddenexception("You do not own this book");
        }
    }

    private Sort resolveSort(String sort) {
        if (sort == null) return Sort.by("createdAt").descending();
        return switch (sort.toLowerCase()) {
            case "oldest"  -> Sort.by("createdAt").ascending();
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating"  -> Sort.by("viewCount").descending();
            default        -> Sort.by("createdAt").descending();
        };
    }

    public Bookresponse toResponse(Book book) {
        Double avgRating = reviewRepository.findAvgRatingByUserId(book.getOwner().getId());

        return Bookresponse.builder()
            .id(book.getId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .isbn(book.getIsbn())
            .category(book.getCategory())
            .description(book.getDescription())
            .coverImageUrl(book.getCoverImageUrl())
            .listingType(book.getListingType())
            .price(book.getPrice())
            .status(book.getStatus())
            .condition(book.getCondition())
            .language(book.getLanguage())
            .pages(book.getPages())
            .publishedYear(book.getPublishedYear())
            .city(book.getCity())
            .area(book.getArea())
            .viewCount(book.getViewCount())
            .requestCount(book.getRequestCount())
            .avgRating(avgRating != null ? avgRating : 0.0)
            .reviewCount(book.getReviews() != null ? book.getReviews().size() : 0)
            .owner(Bookresponse.OwnerSummary.builder()
                .id(book.getOwner().getId())
                .name(book.getOwner().getName())
                .city(book.getOwner().getCity())
                .avgRating(book.getOwner().getAvgRating())
                .totalReviews(book.getOwner().getTotalReviews())
                .verified(book.getOwner().isVerified())
                .build())
            .createdAt(book.getCreatedAt())
            .build();
    }
}

