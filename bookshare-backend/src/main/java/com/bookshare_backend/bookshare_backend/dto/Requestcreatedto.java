package com.bookshare_backend.bookshare_backend.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
public class Requestcreatedto {
    @NotNull
    private Long bookId;

    @Size(max = 500)
    private String message;

    private String pickupPreference;  // "pickup" | "delivery"
    private String exchangeBookTitle;
}