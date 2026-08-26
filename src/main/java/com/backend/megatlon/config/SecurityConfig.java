package com.backend.megatlon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas de autenticación y setup
                        .requestMatchers("/api/v1/auth/setup-status", "/api/v1/auth/login", "/api/v1/auth/setup").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}