package com.bookshare_backend.bookshare_backend.dto;


import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

import com.bookshare_backend.bookshare_backend.entity.Book;

@Data
public class Bookcreaterequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    private String isbn;
    private String category;

    @Size(max = 1000)
    private String description;

    @NotNull(message = "Listing type is required")
    private Book.ListingType listingType;

    @DecimalMin(value = "0.0", message = "Price must be positive")
    private BigDecimal price;

    private Book.BookCondition condition;
    private String language;
    private Integer pages;
    private Integer publishedYear;

    @NotBlank(message = "City is required")
    private String city;

    private String area;
}