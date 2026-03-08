package com.bookshare_backend.bookshare_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Changepasswordrequest {
    @NotBlank
    private String currentPassword;

    @NotBlank @Size(min = 6)
    private String newPassword;

    @NotBlank
    private String confirmPassword;
}








