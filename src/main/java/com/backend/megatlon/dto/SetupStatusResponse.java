package com.backend.megatlon.dto;

public record SetupStatusResponse(
        boolean setupRequired,
        String message
) {}