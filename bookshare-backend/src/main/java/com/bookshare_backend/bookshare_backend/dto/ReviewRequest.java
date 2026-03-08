package com.bookshare_backend.bookshare_backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
public class ReviewRequest {
    @NotNull
    private Long bookId;

    @Min(1) @Max(5) @NotNull
    private Integer rating;

    @Size(max = 1000)
    private String comment;
}








