package com.backend.megatlon.dto;

public record UserCredentials(
        String username,
        String rawPassword
) {}