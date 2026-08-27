package com.backend.megatlon.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String ci;
    private String password;
}