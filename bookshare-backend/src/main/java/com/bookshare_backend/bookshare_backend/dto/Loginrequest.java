package com.bookshare_backend.bookshare_backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Loginrequest {
    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;
}








